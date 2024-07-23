import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
    // const [data, setData] = useState({ email: "", password: "" });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth);
    useEffect(() => {
        if (user || isSuccess) {
          navigate("/");
        }
        dispatch(reset());
      }, [user, isSuccess, dispatch, navigate]);
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };
    
    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container}  onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            className={styles.input}
                            autoComplete="email"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            className={styles.input}
                                autoComplete="current-password"
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                        {isLoading ? "Loading..." : "Login"}
                        </button>
                        {isError && <p className="has-text-centered">{message}</p>}
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New Here?</h1>
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
