import { getAuth, signOut } from "firebase/auth";
import { auth } from "../FireBase/FireBaseConfig/fireBaseConfig";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Navigate, useNavigate } from "react-router-dom";

export default function RSAHome() {
  let loggined = useSelector((state) => state.logginedReducer.loggined);
  const dispatch = useDispatch();
  const [{ width, height }, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.onresize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
  }, []);

  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }
  if (localStorage.getItem("loggined") == "true") {
    return (
      <div
        width={width}
        className="container-fluid"
        style={{ backgroundColor: "#E2DFD0", height: height }}
      >
        <div
          className="row firstRow p-3"
          style={{ backgroundColor: "#524C42", marginBottom: "2%" }}
        >
          <h3 className="account">
            Tài khoản: {JSON.parse(localStorage.getItem("email"))}
          </h3>
          <h1
            className="text-center  h1_firstTitle"
            style={{ color: "#F97300" }}
          >
            Chương trình truyền tin mật sử dụng RSA
          </h1>
        </div>
        <div>
          <h1>Chọn chức năng thực hiện</h1>
          <h3>
            <NavLink to={"/sendmessage"}>1,Gửi tin nhắn</NavLink>
          </h3>
          <h3>
            <NavLink to={"/receivemessage"}>2,Nhận tin nhắn</NavLink>
          </h3>
          {loggined && (
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.setItem("loggined", "false");
                dispatch({
                  type: "LOGGINED_FAILED",
                  loggined: false,
                });
                handleSignOut();
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    );
  } else {
    alert("Vui lòng đăng nhập để có thể dùng ứng dụng");
    return <Navigate to={"/login"} />;
  }
}
