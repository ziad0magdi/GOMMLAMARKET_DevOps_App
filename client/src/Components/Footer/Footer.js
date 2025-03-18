import React, { useContext } from "react";
import { useUser } from "../../context/UserContext";
import "./Footer.css";

const Footer = () => {
  const { isDarkMode, language } = useUser();

  return (
    <footer
      className={`Footer_container ${
        isDarkMode ? "Footer_dark" : "Footer_light"
      }`}
    >
      <p className="Footer_text">
        {language === "en"
          ? "© 2024 My Website. All rights reserved."
          : "© 2024 موقعي. جميع الحقوق محفوظة."}
      </p>
    </footer>
  );
};

export default Footer;
