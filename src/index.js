import React from "react";
import {createRoot} from "react-dom/client"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
//import store
import store from "./redux/configStore";
import {Provider} from "react-redux"
import {firebaseConfig} from "./FireBase/FireBaseConfig/fireBaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
