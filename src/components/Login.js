import { useContext, useEffect, useState } from "react";
import { loginApi } from "../services/UserServices";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const LoginUser = () => {
  const { user, loginContext } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/password is required!");
      return;
    }
    setLoadingApi(true);
    let res = await loginApi(email.trim(), password);
    if (res && res.token) {
      loginContext(email, res.token);
      navigate("/");
    } else {
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingApi(false);
  };

  const handleEventEnter = (event) => {
    if (event && event.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Log in</div>
      <div className="text">Email or username (eve.holt@reqres.in)</div>
      <input
        type="text"
        placeholder="Email or username..."
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <div className="input-password">
        <input
          type={isShowPassword === true ? "text" : "password"}
          placeholder="Password..."
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          onKeyDown={(event) => handleEventEnter(event)}
        />
        <i
          className={
            isShowPassword === true
              ? "fa-solid fa-eye"
              : "fa-solid fa-eye-slash"
          }
          onClick={() => setIsShowPassword(!isShowPassword)}
        ></i>
      </div>
      <button
        className={email && password ? "active" : ""}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        {loadingApi && <i className="fa-solid fa-sync fa-spin"></i>}
        &nbsp; Login
      </button>
      <div className="back">
        <i className="fa-solid fa-angles-left"></i>
        <span
          onClick={() => {
            navigate("/");
          }}
        >
          Go back
        </span>
      </div>
    </div>
  );
};

export default LoginUser;
