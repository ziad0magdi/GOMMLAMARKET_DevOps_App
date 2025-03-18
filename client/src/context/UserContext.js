import {
  createContext,
  useContext,
  useState,
  useEffect,
  useFocusEffecr,
} from "react";
import CryptoJS from "crypto-js";
import axios from "../API/axios";
// Create UserContext
const UserContext = createContext();

// Provide UserContext to the app
export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") || false
  );
  const decryptData = async (encryptedData) => {
    if (!encryptedData) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const [userGroup, setUserGroup] = useState(null);
  const [user_Id, setUserId] = useState(null);
  const [userDepartment, setUserDepartment] = useState();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "ar"
  );

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const SECRET_KEY =
    "13711a765c2335db1eec7192d2c46060e9719304ff5075c194923f8b7cd18ccbe6db7e4818e10e6a6bfb36ac95994657cfbfa6be7bc5a179fad55bc17a21310e";
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || "ar");

    setIsDarkMode(localStorage.getItem("darkMode") === "true");
  }, []);

  useEffect(() => {
    let fetch = async () => {
      setUserGroup(await decryptData(localStorage.getItem("user_group_id")));
      setUserId(await decryptData(localStorage.getItem("user_id")));
      setUserDepartment(
        parseInt(await decryptData(localStorage.getItem("user_department_id")))
      );
    };
    fetch();
  }, []);

  document.documentElement.setAttribute(
    "dir",
    language === "en" ? "ltr" : "rtl"
  );

  const toggleLanguage = () => {
    setLanguage(() => (language === "en" ? "ar" : "en"));
  };

  localStorage.setItem("language", language);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  localStorage.setItem("darkMode", isDarkMode);

  useEffect(() => {
    if (!localStorage.getItem("isLogin")) {
      localStorage.removeItem("user_group_id");
      localStorage.removeItem("user_id");
    }
  }, [localStorage.getItem("isLogin")]);

  return (
    <UserContext.Provider
      value={{
        isLogin,
        setIsLogin,
        userGroup,
        setUserGroup,
        user_Id,
        setUserId,
        userDepartment,
        setUserDepartment,
        language,
        setLanguage,
        isDarkMode,
        setIsDarkMode,
        toggleLanguage,
        toggleTheme,
        SECRET_KEY,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using UserContext
export const useUser = () => {
  return useContext(UserContext);
};
