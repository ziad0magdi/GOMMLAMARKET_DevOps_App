import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "../../API/axios";
import "./SignIn.css";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const SignIn = () => {
  const {
    language,
    isDarkMode,
    SECRET_KEY,
    setIsLogin,
    setUserGroup,
    setUserId,
    setUserDepartment,
  } = useUser();
  // console.log("isLogin", isLogin);
  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/signIn", formData, {
        withCredentials: true,
      });

      if (res.data.Status === "Success") {
        const encryptedUserId = CryptoJS.AES.encrypt(
          res.data.user_id.toString(),
          SECRET_KEY
        ).toString();

        const encryptedUserGroup = CryptoJS.AES.encrypt(
          res.data.user_group_id.toString(),
          SECRET_KEY
        ).toString();

        const encryptedUserDepartment = CryptoJS.AES.encrypt(
          res.data.user_department_id.toString(),
          SECRET_KEY
        ).toString();

        // Store encrypted values in localStorage
        localStorage.setItem("isLogin", true);
        localStorage.setItem("user_id", encryptedUserId);
        localStorage.setItem("user_group_id", encryptedUserGroup);
        localStorage.setItem("user_department_id", encryptedUserDepartment);

        setIsLogin(true);
        setUserGroup(res.data.user_group_id);
        setUserId(res.data.user_id);
        setUserDepartment(res.data.user_department_id);
        navigate("/MyApplication", { replace: true });
      } else {
        toast.error(res.data.Error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign in.");
    }
  };

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  return (
    <div className={`signIn ${isDarkMode ? "signIn_dark" : "signIn_light"}`}>
      <div className="signIn_formContainer">
        <h2>{language === "en" ? "Sign In" : "تسجيل الدخول"}</h2>
        <form className="signIn_form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="email"
            placeholder={language === "en" ? "Email:" : " الايميل:"}
            name="username"
            onChange={(event) =>
              setFormData({ ...formData, user_email: event.target.value })
            }
          />
          <input
            type="password"
            id="password"
            placeholder={language === "en" ? "Password:" : "كلمة المرور:"}
            name="password"
            onChange={(event) =>
              setFormData({ ...formData, user_password: event.target.value })
            }
          />
          <button type="submit">
            {language === "en" ? "Sign In" : "تسجيل الدخول"}
          </button>
          <button onClick={handleSignUpClick}>
            {language === "en" ? "Sign Up" : "تسجيل حساب جديد"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
