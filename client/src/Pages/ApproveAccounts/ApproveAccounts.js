import { React, useState, useEffect } from "react";
import "./ApproveAccounts.css";
import UserAPI from "../../API/UserAPI";
import { useUser } from "../../context/UserContext";
const ApproveAccounts = () => {
  const { isDarkMode, language, userGroup, user_Id } = useUser();
  const [selectedOption, setSelectedOption] = useState("All_Employees");
  const [allEmployees, setAllEmployees] = useState([]);
  const [waitingEmployees, setWaitingEmployees] = useState([]);
  const [approveEmployees, setApproveEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user_Id) return;
        const response = await UserAPI.GetAllEmployeeWithSpacificUser(user_Id);
        setAllEmployees(response.data.User);
        setApproveEmployees(
          response.data.User.filter((user) => user.isApproved === "y")
        );
        setWaitingEmployees(
          response.data.User.filter((user) => user.isApproved === "n")
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user_Id]);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleApprove = async (user_id) => {
    if (!user_id) return;
    UserAPI.ApproveAccounts(user_id);
    window.location.reload();
  };
  const handleDecline = async (user_id) => {
    if (!user_id) return;
    UserAPI.DeclineAccounts(user_id);
    window.location.reload();
  };
  const renderEmployees = (Employees, sectionTitleEn, sectionTitleAr) => {
    console.log("Employees are >>> ", Employees);
    return (
      <div className="MyBooks_section">
        <h2>{language === "en" ? sectionTitleEn : sectionTitleAr}</h2>
        {Employees.length > 0 ? (
          <table className="ApproveAccounts_table">
            <tr>
              <td>
                {language === "en" ? "Employee Full Name" : "إسم الموظف الكامل"}
              </td>
              <td>{language === "en" ? "Employee Phone" : "رقم الموظف"}</td>
              <td>{language === "en" ? "Employee Role" : "دور الموظف"}</td>
              <td>{language === "en" ? "Employee State" : "حالة الموظف"}</td>
            </tr>
            {Employees.map((employee) => (
              <tr>
                <td>{employee.Employee_Full_Name}</td>
                <td>{employee.user_phone}</td>
                <td>{employee.group_role}</td>
                <td>
                  {employee.isApproved === "y" ? (
                    language === "en" ? (
                      "Approve"
                    ) : (
                      "تم الموافقة عليه"
                    )
                  ) : (
                    <div className="ApproveAccounts_Button">
                      <button onClick={() => handleApprove(employee.user_id)}>
                        {language === "en" ? "Approve" : "موافق"}
                      </button>
                      <button onClick={() => handleDecline(employee.user_id)}>
                        {language === "en" ? "Decline" : "رفض"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </table>
        ) : language === "en" ? (
          "No Employees"
        ) : (
          "لا يوجد موظفين"
        )}
      </div>
    );
  };

  return (
    <div className={`MyBooks ${isDarkMode ? "MyBooks_dark" : "MyBooks_light"}`}>
      <div className="MyBooks_container">
        <div className="MyBooks_account-section">
          <h2>{language === "en" ? "Employees" : "الموظفين"}</h2>
          <ul>
            <li
              className={
                selectedOption === "Wating_Approve"
                  ? "MyBooks_active"
                  : undefined
              }
              onClick={() => handleOptionClick("Wating_Approve")}
            >
              {language === "en"
                ? "Employees Waiting to be Approved"
                : "الموظفين في انتظار الموافقة"}
            </li>
            <li
              className={
                selectedOption === "Approved" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("Approved")}
            >
              {language === "en" ? "Approved Employees" : "الموظفين المعتمد"}
            </li>
            <li
              className={
                selectedOption === "All_Employees"
                  ? "MyBooks_active"
                  : undefined
              }
              onClick={() => handleOptionClick("All_Employees")}
            >
              {language === "en" ? "All Employees" : "كل الموظفين"}
            </li>
          </ul>
        </div>
        <main>
          {selectedOption === "Wating_Approve" &&
            renderEmployees(
              waitingEmployees,
              "Employees Waiting to be Approved",
              "الموظفين في انتظار الموافقة"
            )}
          {selectedOption === "Approved" &&
            renderEmployees(
              approveEmployees,
              "Approved Employees",
              "الموظفين المعتمد"
            )}
          {selectedOption === "All_Employees" &&
            renderEmployees(allEmployees, "All Employees", "كل الموظفين")}
        </main>
      </div>
    </div>
  );
};

export default ApproveAccounts;
