import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./styles.module.css";
import { fetchTasks, addTask, updateTask, deleteTask } from '../../features/taskSlice';
import { MdDelete, MdFormatListNumbered } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdCancel } from "react-icons/md";

const TaskManager = () => {
    const dispatch = useDispatch();
    const { tasks = [] } = useSelector((state) => state.tasks);
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState({ title: '', subtasks: [{ task: '', completed: false }] });

    useEffect(() => {
        dispatch(fetchTasks()).unwrap().catch((error) => {
            console.error('Failed to fetch tasks:', error);
        });
    }, [dispatch]);

    const handleTitleChange = (e) => {
        setTask({ ...task, title: e.target.value });
    };

    const handleChange = (e, index) => {
        const newSubtasks = (task.subtasks || []).map((subtask, i) => {
            if (i === index) {
                return { ...subtask, task: e.target.value };
            }
            return subtask;
        });
        setTask({ ...task, subtasks: newSubtasks });
    };

    const addSubtask = () => {
        setTask({ ...task, subtasks: [...task.subtasks, { task: '', completed: false }] });
    };

    const removeSubtask = (index) => {
        const newSubtasks = (task.subtasks || []).filter((_, i) => i !== index);
        setTask({ ...task, subtasks: newSubtasks });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (task._id) {
            await dispatch(updateTask({ id: task._id, updatedTask: task }));
        } else {
            await dispatch(addTask(task));
        }
        setTask({ title: '', subtasks: [{ task: '', completed: false }] });
        setIsEditing(false); // Exit edit mode
        dispatch(fetchTasks()); // Refresh tasks
    };

    const editTask = (taskId) => {
        const selectedTask = tasks.find(task => task._id === taskId);
        setTask(selectedTask || { title: '', subtasks: [{ task: '', completed: false }] });
        setIsEditing(true);
    };

    const updateTaskCompletion = async (taskId, index) => {
        const selectedTask = tasks.find(task => task._id === taskId);
        if (selectedTask) {
            const updatedSubtasks = selectedTask.subtasks.map((subtask, i) => {
                if (i === index) {
                    return { ...subtask, completed: !subtask.completed };
                }
                return subtask;
            });
            await dispatch(updateTask({ id: taskId, updatedTask: { ...selectedTask, subtasks: updatedSubtasks } }));
            dispatch(fetchTasks()); // Refresh tasks after update
        }
    };

    const handleCancel = () => {
        setTask({ title: '', subtasks: [{ task: '', completed: false }] });
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>Task Management</h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <main className={styles.main}>
                <h1 className={styles.heading}>TO-DO</h1>
                <div className={styles.container}>
                    <form onSubmit={handleAddTask} className={styles.form_container}>
                        <input
                            id={styles.title}
                            className={styles.input}
                            type="text"
                            placeholder="Title"
                            name="title"
                            onChange={handleTitleChange}
                            value={task.title}
                        />
                        {task.subtasks.map((subtask, index) => (
                            <div key={index} className={styles.subtask_container}>
                                <input
                                    id={`subtask-${index}`}
                                    className={styles.input}
                                    type="text"
                                    placeholder={`Task ${index + 1}`}
                                    name="task"
                                    onChange={(e) => handleChange(e, index)}
                                    value={subtask.task}
                                />
                                <button type="button" className={styles.btn2} onClick={() => removeSubtask(index)}><MdDelete /></button>
                            </div>
                        ))}
                        <div className={styles.buttons}>
                            <button type="button" className={styles.btn2} onClick={addSubtask}><MdFormatListNumbered /></button>
                            <button type="submit" className={styles.btn}>
                                {isEditing ? <AiFillEdit /> : <IoIosAddCircleOutline />}
                            </button>
                            {isEditing && (
                                <button type="button" className={styles.btn_cancel} onClick={handleCancel}><MdCancel /></button>
                            )}
                        </div>
                    </form>
                    {tasks.length === 0 && <h2 className={styles.no_tasks}>No tasks</h2>}
                </div>
                <div className={styles.tasks}>
                    {(tasks || []).map((task) => (
                        <div className={styles.task_container} key={task._id}>
                            <h3>{task.title}</h3>
                            {(task.subtasks || []).map((subtask, index) => (
                                <div key={index} className={styles.subtasks}>
                                    <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        className={styles.check}
                                        onChange={() => updateTaskCompletion(task._id, index)}
                                    />
                                    <p className={subtask.completed ? `${styles.completed_task} ${styles.line_through}` : styles.task}>
                                        {subtask.task}
                                    </p>
                                </div>
                            ))}
                            <div className={styles.buttons} id={styles.buttonsfortask} >
                                <button onClick={() => editTask(task._id)} className={styles.edit_task}>
                                    <AiFillEdit />
                                </button>
                                <button onClick={() => dispatch(deleteTask(task._id))} className={styles.remove_task}>
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TaskManager;
