import React, { useState } from "react";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FireBase/FireBaseConfig/fireBaseConfig";
import CryptoJS from 'crypto-js';

export default function LoginCyberBugs(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn(e) {
    e.preventDefault();

    // Băm mật khẩu bằng SHA-256
    const hashedPassword = CryptoJS.SHA256(password).toString();

    signInWithEmailAndPassword(auth, email, hashedPassword)
    .then((user) => {
      console.log("user", user);
      navigate("/home");
      localStorage.setItem("loggined", "true");
      localStorage.setItem("email", JSON.stringify(email));
      dispatch({
        type: "LOGGINED_SUCCESS",
        loggined: true,
      });
    })
    .catch((err) => {
      console.log(err);
      localStorage.setItem("loggined", "false");
      dispatch({
        type: "LOGGINED_FAILED",
        loggined: false,
      });
    });
  }

  return (
    <form onSubmit={handleSignIn} className="container">
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: window.innerHeight }}>
        <h3 style={{ fontWeight: 300, fontSize: 35 }} className="text-center mb-4">Login</h3>
        <div>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            style={{ minWidth: "400px" }}
            size="large"
            placeholder="Email"
            prefix={<UserOutlined />}
          />
        </div>
        <div>
          <Input.Password
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            style={{ minWidth: "400px" }}
            className="mt-3"
            iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            size="large"
            placeholder="Password"
            prefix={<LockOutlined />}
          />
        </div>
        <div className="d-flex flex-row">
          <Button
            htmlType="submit"
            className="mt-3"
            style={{ backgroundColor: "rgb(102,117,223)", minWidth: 400 }}
            type="primary"
            size="large"
          >
            Login
          </Button>
        </div>
        <div className="mt-3 d-flex flex-row text-start" style={{ minWidth: "400px", fontSize: "20px" }}>
          <p className="me-4">Don't have an account?</p>
          <NavLink to={"/register"}>Sign Up</NavLink>
        </div>
        <div className="mt-3">
          <Button
            style={{ backgroundColor: "rgb(59,89,142)" }}
            className="me-3"
            type="primary"
            size="large"
            shape="circle"
          >
            <i className="fab fa-facebook-f"></i>
          </Button>
          <Button type="primary" size="large" shape="circle">
            <i className="fab fa-twitter"></i>
          </Button>
        </div>
      </div>
    </form>
  );
}
