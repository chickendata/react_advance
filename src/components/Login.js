import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginRedux } from "../redux/action/userAction";
import { useDispatch, useSelector } from "react-redux";

const LoginUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isLoading = useSelector((state) => state.user.isLoading);
  const account = useSelector((state) => state.user.account);

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
    dispatch(handleLoginRedux(email, password));
  };

  const handleEventEnter = (event) => {
    if (event && event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    if (account && account.auth === true) {
      navigate("/");
    }
  }, [account]);
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
        {isLoading && <i className="fa-solid fa-sync fa-spin"></i>}
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
