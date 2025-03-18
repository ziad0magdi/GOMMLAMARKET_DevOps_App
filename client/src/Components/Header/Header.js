import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gommlaimage from "./images/GommlaMarket.ico";
import { useUser } from "../../context/UserContext";
import "./Header.css";

const Header = () => {
  const { isDarkMode, language, toggleTheme, toggleLanguage, isLogin } =
    useUser();

  const navigate = useNavigate();

  const handleSingInClick = () => {
    navigate(`/`);
  };

  const handleSingOutClick = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("user_group_id");
    localStorage.removeItem("user_id");
    navigate(`/`);
    window.location.reload();
  };
  return (
    <header
      className={`Header_container ${
        isDarkMode ? "Header_dark" : "Header_light"
      }`}
    >
      <div className="Header_left">
        <img
          className="Header_GommlaIcon"
          src={gommlaimage}
          alt="Gommla Market Icon"
        />
      </div>

      <div className="Header_right">
        <button className="Header_toggleTheme" onClick={toggleTheme}>
          {isDarkMode
            ? language === "en"
              ? "Light Mode"
              : "الوضع النهاري"
            : language === "en"
            ? "Dark Mode"
            : "الوضع الليلي"}
        </button>

        <button className="Header_toggleLanguage" onClick={toggleLanguage}>
          {language === "en" ? "عربي" : "English"}
        </button>
        <ul className="sign">
          <li>
            {isLogin ? (
              <button className="signIn_btn" onClick={handleSingOutClick}>
                {language === "en" ? "Signout" : "تسجيل الخروج"}
              </button>
            ) : (
              <button className="signIn_btn" onClick={handleSingInClick}>
                {language === "en" ? "SignIn" : "تسجيل الدخول"}
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
