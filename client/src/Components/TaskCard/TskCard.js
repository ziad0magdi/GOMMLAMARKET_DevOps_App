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

  console.log("Task in task card >>> ", task);

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
        <h3 className="TaskCard_title">{task.application_id}</h3>
        <h4 className="TaskCard_title">{task.application_description}</h4>

        <div></div>
        <div>
          <p className="TaskCard_Details">
            {task.application_start_date
              ? language === "en"
                ? "Application start date: " + task.application_start_date
                : "تاريخ بدء التطبيق: " + task.application_start_date
              : language === "en"
              ? "Application Start Date has not been set yet"
              : "لم يتم تحديد تاريخ البداية التطبيق بعد"}
          </p>
          <p className="TaskCard_Details">
            {task.application_duration
              ? language === "en"
                ? "Application duration: " + task.application_duration
                : "مدة التطبيق: " + task.application_duration
              : language === "en"
              ? "Application Duration has not been set yet"
              : "لم يتم تحديد مدة التطبيق بعد"}
          </p>
          <p className="TaskCard_Details">
            {task.application_end_date
              ? language === "en"
                ? "Application End Date" + task.application_end_date
                : "تاريخ نهاية التطبيق: " + task.application_end_date
              : language === "en"
              ? "Application End Date has not been set yet"
              : "لم يتم تحديد تاريخ بدء التطبيق بعد"}
          </p>
          <p className="TaskCard_Details">
            {language === "en"
              ? "Application State:" + task.apps_tasks_meetings_status_name
              : "حالة التطبيق: " + task.apps_tasks_meetings_status_name}
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
        {task.The_User_Who_Work_On_This_Task
          ? task.The_User_Who_Work_On_This_Task
          : language === "en"
          ? "No one has been assigned to this thask yet."
          : "لم يتم تكليف أحد بهذه المهمة بعد."}
      </h4>
      <div></div>
      <div>
        <p className="TaskCard_Details">
          {task.Task_Start_Date
            ? language === "en"
              ? "Task Start Date:" + task.Task_Start_Date
              : "تاريخ بدء المهمة: " + task.Task_Start_Date
            : language === "en"
            ? "Task did not Start yet"
            : "لم تبدأ المهمة بعد"}
        </p>
        <p className="TaskCard_Details">
          {task.Task_Duration
            ? language === "en"
              ? "Task Duration:" + task.Task_Duration
              : "مدة التطبيق: " + task.Task_Duration
            : language === "en"
            ? "Task did not Start yet"
            : "لم تبدأ المهمة بعد"}
        </p>
        <p className="TaskCard_Details">
          {task.Task_End_Date
            ? language === "en"
              ? "Task Deadline:" + task.Task_End_Date
              : "تاريخ بدء التطبيق: " + task.Task_End_Date
            : language === "en"
            ? "Task did not Start yet"
            : "لم تبدأ المهمة بعد"}
        </p>
        <p className="TaskCard_Details">
          {language === "en"
            ? "Task Status:" + task.Task_Status
            : "حالة المهمة: " + task.Task_Status}
        </p>
      </div>
    </div>
  );
};

export default TaskCard;

/**------------------------------------------ */
//         <h3 className="TaskCard_title">{task.application_id}</h3>
//         <h4 className="TaskCard_title">
//           {applicationData.applicationInfo[0].Application_Description}
//         </h4>
//         <div>
//           <p className="TaskCard_Details">
//             {applicationData.applicationInfo[0].Application_Start_Date
//               ? language === "en"
//                 ? "Application start date: " +
//                   applicationData.applicationInfo[0].Application_Start_Date
//                 : "تاريخ بدء التطبيق: " +
//                   applicationData.applicationInfo[0].Application_Start_Date
//               : language === "en"
//               ? "Application Start Date has not been set yet"
//               : "لم يتم تحديد تاريخ البداية التطبيق بعد"}
//
//           </p>
//           <p className="TaskCard_Details">
//             {applicationData.applicationInfo[0].Application_Duration
//               ? language === "en"
//                 ? "Application duration: " +
//                   applicationData.applicationInfo[0].Application_Duration
//                 : "مدة التطبيق: " +
//                   applicationData.applicationInfo[0].Application_Duration
//               : language === "en"
//               ? "Application Duration has not been set yet"
//               : "لم يتم تحديد مدة التطبيق بعد"}
//           </p>
//           <p className="TaskCard_Details">
//             {applicationData.applicationInfo[0].Application_End_Date
//               ? language === "en"
//                 ? "Application End Date" +
//                   applicationData.applicationInfo[0].Application_End_Date
//                 : "تاريخ نهاية التطبيق: " +
//                   applicationData.applicationInfo[0].Application_End_Date
//               : language === "en"
//               ? "Application End Date has not been set yet"
//               : "لم يتم تحديد تاريخ بدء التطبيق بعد"}
//           </p>
//           <p className="TaskCard_Details">
//             {language === "en"
//               ? "Application State:" +
//                 applicationData.applicationInfo[0].Application_State
//               : "حالة التطبيق: " +
//                 applicationData.applicationInfo[0].Application_State}
//           </p>
//         </div>
//       </div>
//     </Link>
//   ) : (

//   );
// };
