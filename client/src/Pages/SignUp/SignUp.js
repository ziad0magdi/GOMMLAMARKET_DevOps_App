import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import DepartmentAPI from "../../API/DepartmentAPI";
import BranchAPI from "../../API/BranchAPI";
import UserAPI from "../../API/UserAPI";
import "./SignUp.css";

const SignUp = () => {
  const { isDarkMode, language } = useUser();
  const [formData, setFormData] = useState({
    user_fname: "",
    user_lname: "",
    user_phone: "",
    user_email: "",
    user_password: "",
    user_confirm_password: "",
    user_branch_id: "",
    user_department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [branchs, setBranchs] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();

  useEffect(() => {
    setFormData({ ...formData, user_department_id: selectedDepartment });
  }, [selectedDepartment]);

  useEffect(() => {
    setFormData({ ...formData, user_branch_id: selectedBranch });
  }, [selectedBranch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result1 = await DepartmentAPI.GetAllDepartments();
        const result2 = await BranchAPI.GetAllBranchs();
        setDepartments(result1.data);
        setBranchs(result2.data);
      } catch (error) {
        console.log("Error fetching departments", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const response = await UserAPI.AddUser(formData);
      alert("User Adding successfully!");
      navigator.push("/");
    } catch (error) {
      console.error("Error Adding User:", error);
    }
  };

  return (
    <div className={`signUp ${isDarkMode ? "signUp_dark" : "signUp_light"}`}>
      <div className="signUp_formContainer">
        <h2>{language === "ar" ? "التسجيل" : "Sign Up"}</h2>
        <form className="signUp_form">
          <input
            type="text"
            placeholder={language === "ar" ? "الاسم الأول" : "First Name"}
            name="user_fname"
            value={formData.user_fname}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder={language === "ar" ? "اسم العائلة" : "Last Name"}
            name="user_lname"
            value={formData.user_lname}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder={language === "ar" ? "رقم الهاتف" : "Phone Number"}
            name="user_phone"
            value={formData.user_phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
            name="user_email"
            value={formData.user_email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            placeholder={language === "ar" ? "كلمة المرور" : "Password"}
            name="user_password"
            value={formData.user_password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            placeholder={
              language === "ar" ? "تأكيد كلمة المرور" : "Password confirm"
            }
            name="user_confirm_password"
            value={formData.user_confirm_password}
            onChange={handleInputChange}
            required
          />
          <div className="SignUp_select">
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
              }}
            >
              <option value="">
                {language === "en" ? "Select Branch" : "اختر الفرع"}
              </option>
              {branchs.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
              }}
            >
              <option value="">
                {language === "en" ? "Select Department" : "اختر القسم"}
              </option>
              {departments.map((department) => (
                <option
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={
              formData.user_password !== formData.user_confirm_password ||
              formData.user_phone.length !== 11
            }
          >
            {language === "ar" ? "تسجيل" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
