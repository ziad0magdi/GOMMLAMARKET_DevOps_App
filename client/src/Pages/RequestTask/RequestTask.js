import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import TaskAPI from "../../API/TaskAPI";
import "./RequestTask.css";
const RequestTask = () => {
  const { isDarkMode, language, user_Id } = useUser([]);
  const location = useLocation();
  const application_id = location.state?.application_id;
  const [formData, setFormData] = useState({
    application_id: application_id,
    task_request_user_id: user_Id,
    task_description: "",
    pdfFile: null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      task_request_user_id: user_Id,
      [name]: value,
    });
  };

  console.log(formData);

  const handleFileChange = (e) => {
    setFormData({ ...formData, pdfFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await TaskAPI.AddTask(formData);
      console.log("The form data >>>", formData);
      alert("Task request submitted successfully!");
    } catch (error) {
      console.error("Error submitting Task request:", error);
    }
  };

  return (
    <div className={isDarkMode ? "RequestTask_dark" : "RequestTask_light"}>
      <div className="RequestTask_container">
        <form
          className={`RequestTask_form ${
            isDarkMode ? "RequestTask_dark" : "RequestTask_light"
          }`}
          onSubmit={handleSubmit}
        >
          <h2 className="RequestTask_title">
            {language === "en" ? "Create Task Request" : "إنشاء طلب مهمة"}
          </h2>

          {/* Task Description */}
          <div className="RequestTask_field">
            <label className="RequestTask_label">
              {language === "en" ? "Task Description:" : "وصف المهمة:"}
            </label>
            <textarea
              name="task_description"
              className="RequestTask_textarea"
              value={formData.task_description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* Upload PDF File */}
          <div className="RequestTask_field">
            <label className="RequestTask_label">
              {language === "en"
                ? "Upload PDF file (Optional):"
                : "تحميل ملف PDF (اختياري):"}
            </label>
            <input
              type="file"
              name="pdfFile"
              className="RequestTask_fileInput"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="RequestTask_button">
            {language === "en" ? "Submit" : "إرسال"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestTask;
