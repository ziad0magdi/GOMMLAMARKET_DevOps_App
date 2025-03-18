import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import ApplicationAPI from "../../API/ApplicationAPI";
import DepartmentAPI from "../../API/DepartmentAPI";
import "./RequestApplication.css";

const RequestApplication = () => {
  const { isDarkMode, language, user_Id } = useUser([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();

  const [formData, setFormData] = useState({
    department_id: "",
    application_request_user_id: user_Id,
    application_description: "",
    pdfFile: null,
  });
  useEffect(() => {
    setFormData({ ...formData, department_id: selectedDepartment });
  }, [selectedDepartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      application_request_user_id: user_Id,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await DepartmentAPI.GetAllDepartments();
        setDepartments(result.data);
      } catch (error) {
        console.log("Error fetching departments", error);
      }
    };
    fetchData();
  }, [user_Id]);
  console.log(departments);
  console.log(selectedDepartment);
  console.log(formData);

  const handleFileChange = (e) => {
    setFormData({ ...formData, pdfFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApplicationAPI.AddApplications(formData);
      alert("Application request submitted successfully!");
    } catch (error) {
      console.error("Error submitting application request:", error);
    }
  };

  return (
    <div
      className={
        isDarkMode ? "RequestApplication_dark" : "RequestApplication_light"
      }
    >
      <div className="RequestApplication_container">
        <form
          className={`RequestApplication_form ${
            isDarkMode ? "RequestApplication_dark" : "RequestApplication_light"
          }`}
          onSubmit={handleSubmit}
        >
          <h2 className="RequestApplication_title">
            {language === "en"
              ? "Create Application Request"
              : "إنشاء طلب تطبيق"}
          </h2>

          {/* Application Description */}
          <div className="RequestApplication_field">
            <label className="RequestApplication_label">
              {language === "en"
                ? "Request Application From Department:"
                : "طلب التطبيق من قسم:"}
            </label>
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
            <label className="RequestApplication_label">
              {language === "en" ? "Application Description:" : "وصف التطبيق:"}
            </label>
            <textarea
              name="application_description"
              className="RequestApplication_textarea"
              value={formData.application_description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* Upload PDF File */}
          <div className="RequestApplication_field">
            <label className="RequestApplication_label">
              {language === "en"
                ? "Upload PDF file (Optional):"
                : "تحميل ملف PDF (اختياري):"}
            </label>
            <input
              type="file"
              name="pdfFile"
              className="RequestApplication_fileInput"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="RequestApplication_button">
            {language === "en" ? "Submit" : "إرسال"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestApplication;
