import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TaskCard.css";
import { useUser } from "../../context/UserContext";
import ApplicationAPI from "../../API/ApplicationAPI";

const TaskCard = ({ task, onClick, activecard, application_id }) => {
  const [applicationData, setApplicationData] = useState([]);
  const { isDarkMode, language } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApplicationAPI.getAllApplicationsinformations(
          application_id
        );
        setApplicationData(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [application_id]);

  return application_id ? (
    <Link to={`/Application/${application_id}`}>
      <div
        className={`TaskCard ${
          isDarkMode
            ? activecard
              ? "Active_TaskCard_dark"
              : "TaskCard_dark"
            : activecard
            ? "Active_TaskCard_light"
            : "TaskCard_light"
        }`}
        onClick={onClick}
      >
        <h3 className="TaskCard_title">
          {task.application_id || task.task_id}
        </h3>
        <h4 className="TaskCard_title">
          {task.application_description || task.The_Task_Description}
        </h4>
        <h4 className="TaskCard_title">
          {task.The_User_Who_Work_on_The_Application ||
            task.The_User_Who_Work_On_This_Task}
        </h4>
        <div></div>
        <div>
          <p className="TaskCard_Details">
            Task1 Start Date:{" "}
            {task.Application_Start_Date || task.Task_Start_Date}
          </p>
          <p className="TaskCard_Details">
            Task1 Duration Date:{" "}
            {task.Application_Duration || task.Task_Duration}
          </p>
          <p className="TaskCard_Details">
            Task1 Deadline: {task.Application_End_Date || task.Task_End_Date}
          </p>
          <p className="TaskCard_Details">
            Task1 status: {task.Application_State || task.Task_Status}
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <div
      className={`TaskCard ${
        isDarkMode
          ? activecard
            ? "Active_TaskCard_dark"
            : "TaskCard_dark"
          : activecard
          ? "Active_TaskCard_light"
          : "TaskCard_light"
      }`}
      onClick={onClick}
    >
      <h3 className="TaskCard_title">{task.application_id || task.task_id}</h3>
      <h4 className="TaskCard_title">
        {task.application_description || task.The_Task_Description}
      </h4>
      <h4 className="TaskCard_title">
        {task.The_User_Who_Work_on_The_Application ||
          task.The_User_Who_Work_On_This_Task}
      </h4>
      <div></div>
      <div>
        <p className="TaskCard_Details">
          Task1 Start Date:{" "}
          {task.Application_Start_Date || task.Task_Start_Date}
        </p>
        <p className="TaskCard_Details">
          Task1 Duration Date: {task.Application_Duration || task.Task_Duration}
        </p>
        <p className="TaskCard_Details">
          Task1 Deadline: {task.Application_End_Date || task.Task_End_Date}
        </p>
        <p className="TaskCard_Details">
          Task1 status: {task.Application_State || task.Task_Status}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;
