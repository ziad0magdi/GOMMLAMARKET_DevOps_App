import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./NavBar.css";

const NavBar = () => {
  const { isDarkMode, language, isLogin, userGroup } = useUser();

  // Only render the NavBar if the user is logged in
  if (!isLogin) {
    return null;
  }
  return (
    <nav
      className={`NavBar_container ${
        isDarkMode ? "NavBar_dark" : "NavBar_light"
      }`}
    >
      <ul className="NavBar_menu">
        <Link className="NavBar_link_item" to="/MyApplication">
          <li className="NavBar_item">
            {language === "en" ? "Requested Application" : "التطبيقات المطلوبة"}
          </li>
        </Link>

        {Number(userGroup) != 3 && (
          <Link className="NavBar_link_item" to="/RequestApplication">
            <li className="NavBar_item">
              {language === "en" ? "Request Application" : "طلب تطبيق"}
            </li>
          </Link>
        )}

        {Number(userGroup) != 3 && (
          <Link className="NavBar_link_item" to="/Empolyees">
            <li className="NavBar_item">
              {language === "en" ? "Employees" : "الموظفين"}
            </li>
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
