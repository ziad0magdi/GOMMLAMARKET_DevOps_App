import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import TaskCard from "../../Components/TaskCard/TskCard";
import ApplicationAPI from "../../API/ApplicationAPI";
import "./Mytask.css";

import CryptoJS from "crypto-js";

const MyApplication = () => {
  const { isDarkMode, language, SECRET_KEY, userGroup, user_Id } = useUser();
  const [selectedOption, setSelectedOption] = useState("requested");
  const [allApplications, setAllApplications] = useState([]);
  const [requestedApps, setRequestedApps] = useState([]);
  const [canceledApps, setCanceledApps] = useState([]);
  const [approvedApps, setApprovedApps] = useState([]);
  const [rejectedApps, setRejectedApps] = useState([]);
  const [inprogressApps, setInProgressApps] = useState([]);
  const [completedApps, setCompletedApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApplicationAPI.getAllUserApplications(user_Id);
        // setAllApplications(response.data.applications);
        setRequestedApps(
          response.data.applications.filter(
            (app) => app.application_status_id === 1
          )
        );
        setCanceledApps(
          response.data.applications.filter(
            (app) => app.application_status_id === 2
          )
        );
        setApprovedApps(
          response.data.applications.filter(
            (app) => app.application_status_id === 3
          )
        );
        setRejectedApps(
          response.data.applications.filter(
            (app) => app.application_status_id === 4
          )
        );
        setInProgressApps(
          response.data.applications.filter(
            (app) => app.application_status_id === 5
          )
        );
        setCompletedApps(
          response.data.applications.filter(
            (app) => app.application_status_id === 6
          )
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user_Id]); // Add user_Id as dependency to trigger fetch when it changes
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  console.log(user_Id, "from My App ");
  const renderBooks = (apps, sectionTitleEn, sectionTitleAr) => {
    return (
      <div className="MyBooks_section">
        <h2 className="MyBooks_sectionTitle">
          {language === "en" ? sectionTitleEn : sectionTitleAr}
        </h2>
        <div className="MyBooks_booksContainer">
          {apps.length > 0 ? (
            apps.map((app, index) => (
              <TaskCard
                key={index}
                task={app}
                application_id={app.application_id}
              />
            ))
          ) : (
            <p className="MyBooks_noBooks">
              {language === "en"
                ? "No Applications available"
                : "لا توجد تطبيقات"}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`MyBooks ${isDarkMode ? "MyBooks_dark" : "MyBooks_light"}`}>
      <div className="MyBooks_container">
        <div className="MyBooks_account-section">
          <h2>{language === "en" ? "Applications" : "التطبيقات"}</h2>
          <ul>
            <li
              className={
                selectedOption === "requested" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("requested")}
            >
              {language === "en"
                ? "Applications Was Requested but Still Not Approved"
                : "التطبيقات التي تم طلبها و لم يتم الموافقة عليها بعد"}
            </li>
            <li
              className={
                selectedOption === "canceled" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("canceled")}
            >
              {language === "en"
                ? "Applications Was Requsted and got Canceled"
                : "التطبيقات التي تم طلبها و لم يتم إلغائها"}
            </li>
            <li
              className={
                selectedOption === "rejected" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("rejected")}
            >
              {language === "en"
                ? "Applications Was Reviwed And Got Rejected."
                : "التطبيقات التي تم مراجعتها و تم رفضها."}
            </li>
            <li
              className={
                selectedOption === "approved" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("approved")}
            >
              {language === "en"
                ? "Applications Was Approved But Still Not Assigned"
                : "التطبيقات التي تم الموافقة عليها لكن لم يتم تكليف احد بها"}
            </li>
            <li
              className={
                selectedOption === "inprogress" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("inprogress")}
            >
              {language === "en"
                ? "Applications being worked on"
                : "التطبيقات التي يتم العمل عليها"}
            </li>
            <li
              className={
                selectedOption === "completed" ? "MyBooks_active" : undefined
              }
              onClick={() => handleOptionClick("completed")}
            >
              {language === "en"
                ? "Applications completed"
                : "التطبيقات التي تم الإنتهاء منها"}
            </li>
          </ul>
        </div>
        <main>
          {selectedOption === "canceled" &&
            renderBooks(
              canceledApps,
              "Canceled Applications",
              "التطبيقات التي تم إلغائها"
            )}
          {selectedOption === "requested" &&
            renderBooks(
              requestedApps,
              "Applications Waiting to be Approved",
              "التطبيقات قيد إنتظار الموافقة عليها"
            )}
          {selectedOption === "rejected" &&
            renderBooks(
              rejectedApps,
              "Rejected Approved",
              "التطبيقات التي تم رفضها"
            )}
          {selectedOption === "approved" &&
            renderBooks(
              approvedApps,
              "Approved applications",
              "التطبيقات التي تم الموافقة عليها"
            )}
          {selectedOption === "inprogress" &&
            renderBooks(
              inprogressApps,
              "In Progress applications",
              "التطبيقات قيد العمل عليها"
            )}
          {selectedOption === "completed" &&
            renderBooks(
              completedApps,
              "Completed applications",
              "التطبيقات المكتملة"
            )}
        </main>
      </div>
    </div>
  );
};

export default MyApplication;
