import React from "react";
import { createRoot } from "react-dom/client"; // Import from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from 'react-redux';
import store from './app/store';
import {disableReactDevTools} from '@fvilers/disable-react-devtools'
const rootElement = document.getElementById("root");
const root = createRoot(rootElement); // Use createRoot
if (ProcessingInstruction.env.NODE_ENV==="production")disableReactDevTools()
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
