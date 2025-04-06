import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Application.css";
import { Plus } from "lucide-react";
import Modal from "react-modal";
import TaskCard from "../TaskCard/TskCard";
import ApplicationAPI from "../../API/ApplicationAPI";
import UserAPI from "../../API/UserAPI";
import TaskAPI from "../../API/TaskAPI";
import MeetingAPI from "../../API/MeetingAPI";
import PDFViewer from "../PDFViewer/MyPdfViewer";

const Application = () => {
  const { isDarkMode, language, user_Id, userGroup, userDepartment } =
    useUser();
  const [applicationData, setApplicationData] = useState(null);
  const [tasks, setTasks] = useState(null);

  const [selectedState, setSelectedState] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [selectedEmployeeforTask, setSelectedEmployeeforTask] = useState();
  const [selectedDuration, setSelectedDuration] = useState();
  const [selectedDurationUnit, setSelectedDurationUnit] = useState();
  const [durationforTask, setDurationforTask] = useState();
  const [durationUnitforTask, setDurationUnitforTask] = useState();
  const [selectedDurationforTask, setSelectedDurationforTask] = useState();
  const [selectedDurationUnitforTask, setSelectedDurationUnitforTask] =
    useState();
  const [activeCards, setActiveCards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [workEmployees, setWorkEmployees] = useState([]);
  const navigate = useNavigate();
  const { application_id } = useParams();
  const [pdfsPath, setPdfsPath] = useState();
  const [selectedPdf, setSelectedPdf] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user_Id || !application_id) return;

    const fetchData = async () => {
      try {
        const response = await ApplicationAPI.getAllApplicationsinformations(
          application_id,
          Number(user_Id)
        );
        setApplicationData(response.data);
        setPdfsPath([
          response.data.applicationInfo[0].Application_Desription_File_Path,
        ]);
        setTasks(response.data.tasks);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user_Id, application_id]);

  useEffect(() => {
    if (!user_Id) return;
    const fetchData = async () => {
      try {
        const response1 = await UserAPI.GetAllEmployeeWithSpacificUser(user_Id);
        setEmployees(response1.data.User);
        const response2 = await ApplicationAPI.getApplicationWorkOn(
          application_id
        );
        setWorkEmployees(response2.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user_Id]);
  const toggleCard = (index) => {
    setActiveCards((prev) => {
      const newActiveCards = new Array(prev.length).fill(false);
      newActiveCards[index] = !prev[index];
      return newActiveCards;
    });
  };

  if (!applicationData) {
    return (
      <div className="Application_loading">
        {language === "en" ? "Loading..." : "جاري التحميل..."}
      </div>
    );
  }

  const handleMeetingClick = () => {
    navigate(`/MeetingRequest`, { state: { application_id } });
  };

  const handleAssignUser = (user_Id, application_Id) => {
    ApplicationAPI.AssginApplication(user_Id, application_Id);
    window.location.reload();
  };

  const handleReAssignUser = (olduser_Id, user_Id, application_Id) => {
    ApplicationAPI.ChanageAssginApplication(
      olduser_Id,
      user_Id,
      application_Id
    );
    window.location.reload();
  };
  const handleAssignUsertoTask = (user_id, task_id, application_id) => {
    TaskAPI.AssginTask(user_id, task_id, application_id);
    window.location.reload();
  };
  const handleDuration = (duration, duration_unit, application_Id, user_Id) => {
    if (!duration || !duration_unit || !application_Id || !user_Id) {
      return;
    }
    ApplicationAPI.AssginDuration(
      duration,
      duration_unit,
      application_Id,
      user_Id
    );
    window.location.reload();
  };
  const handleDurationforTask = (duration, duration_unit, task_id) => {
    if (!duration || !duration_unit || !task_id) {
      return;
    }
    TaskAPI.AssignDuration(duration, duration_unit, task_id);
    window.location.reload();
  };

  const handlecancle = () => {
    ApplicationAPI.CancleApplication(application_id);
    window.location.reload();
  };

  const handleApprove = () => {
    ApplicationAPI.ApproveApplication(user_Id, application_id);
    window.location.reload();
  };

  const handleDecline = () => {
    ApplicationAPI.DeclineApplication(user_Id, application_id);
    window.location.reload();
  };

  const handleChanageApplicationState = () => {
    ApplicationAPI.ChanageApplicationState(selectedState, application_id);
    window.location.reload();
  };

  const handleChanageApplicationDuration = (
    duration,
    duration_unit,
    application_id
  ) => {
    if (!duration || !duration_unit || !application_id) {
      return;
    }
    ApplicationAPI.ChanageApplicationDuration(
      duration,
      duration_unit,
      application_id
    );
    window.location.reload();
  };

  const handleChanageTaskDuration = (duration, duration_unit, task_id) => {
    if (!duration || !duration_unit || !task_id) {
      return;
    }
    TaskAPI.changeTaskDuration(duration, duration_unit, task_id);
    window.location.reload();
  };
  const handleApproveMeeting = (meeting_id) => {
    MeetingAPI.ApproveMeeting(meeting_id, user_Id);
    window.location.reload();
  };
  const handleDeclineMeeting = (meeting_id) => {
    MeetingAPI.DeclineMeeting(meeting_id, user_Id);
    window.location.reload();
  };

  const difference = employees.filter(
    (employee1) =>
      !workEmployees.some(
        (employees2) => employee1.user_id === employees2.Employee_Id
      )
  );

  const openModal = () => {
    if (selectedPdf) {
      setModalOpen(true);
    }
  };

  const getDateDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  };

  const getDateAdding = (duration, duration_unit) => {
    const start = new Date();
    if (duration_unit === "week" || duration_unit === "أسبوع") {
      duration = duration * 7;
    } else if (duration_unit === "month" || duration_unit === "شهر") {
      duration = duration * 30;
    } else if (duration_unit === "year" || duration_unit === "سنة") {
      duration = duration * 365;
    }
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    return end.toISOString().slice(0, 10); // returns YYYY-MM-DD
  };
  // console.log("PDF Files >>> ", pdfsPath);
  // console.log("Chosen PDF File >>> ", selectedPdf);
  // console.log("The Employees who work on application >>> ", workEmployees);
  // console.log("User ID >>> ", user_Id);
  // console.log("User Group >>> ", userGroup);
  // console.log("User Department >>> ", userDepartment, typeof userDepartment);
  // console.log(
  //   "Application Department >>> ",
  //   applicationData.applicationInfo[0].Application_department_id,
  //   typeof applicationData.applicationInfo[0].Application_department_id
  // );
  // console.log(
  //   "the user who work on this application >>> ",
  //   applicationData.applicationInfo[0].The_User_Who_work_on_The_Application_id
  // );
  console.log(applicationData.meetings);

  return (
    <div
      className={`Application ${
        isDarkMode ? "Application_dark" : "Application_light"
      }`}
    >
      <div className="Application_details">
        <table className="Application_table">
          <tbody>
            <tr>
              <td>{language === "en" ? "Start Date" : "تاريخ البدء"}</td>
              <td>
                {applicationData.applicationInfo[0]?.Application_Start_Date}
              </td>

              <td>{language === "en" ? "Number of Tasks" : "عدد المهام"}</td>
              <td>{tasks.total[0]?.The_number_of_Tasks}</td>
              <td>
                {language === "en"
                  ? "User Who Requested the Application"
                  : "المستخدم الذي طلب التطبيق"}
              </td>
              <td>
                {
                  applicationData.applicationInfo[0]
                    ?.The_User_Who_request_The_Application
                }
              </td>
            </tr>
            <tr>
              <td>{language === "en" ? "Duration" : "المدة"}</td>
              <td>
                {applicationData.applicationInfo[0]?.Application_Duration &&
                applicationData.applicationInfo[0]
                  ?.The_User_Who_Work_on_The_Application ? (
                  userGroup !== "3" &&
                  userDepartment ===
                    applicationData.applicationInfo[0]
                      .Application_department_id ? (
                    <div className="select_employee">
                      {applicationData.applicationInfo[0].Application_Duration}
                      <div>
                        <input
                          type="number"
                          onChange={(e) => setSelectedDuration(e.target.value)}
                        />
                        <select
                          value={selectedDurationUnit}
                          onChange={(e) => {
                            setSelectedDurationUnit(e.target.value);
                          }}
                        >
                          <option value="">
                            {language === "en"
                              ? "Select Duration Unit"
                              : "اختر وحدة المدة"}
                          </option>
                          <option>{language === "en" ? "Day" : "يوم"}</option>
                          <option>
                            {language === "en" ? "Week" : "أسبوع"}
                          </option>
                          <option>{language === "en" ? "Month" : "شهر"}</option>
                          <option>{language === "en" ? "Year" : "سنة"}</option>
                        </select>

                        <button
                          onClick={() =>
                            handleChanageApplicationDuration(
                              selectedDuration,
                              selectedDurationUnit,
                              application_id
                            )
                          }
                          disabled={
                            !selectedDuration ||
                            !selectedDurationUnit ||
                            selectedDuration <= 0
                          }
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ) : (
                    applicationData.applicationInfo[0].Application_Duration
                  )
                ) : (
                  userDepartment ===
                    applicationData.applicationInfo[0]
                      .Application_department_id &&
                  applicationData.applicationInfo[0]
                    ?.The_User_Who_Work_on_The_Application &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    1 &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    2 &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    4 &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    6 && (
                    <div>
                      <input
                        type="number"
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      />
                      <select
                        value={selectedDurationUnit}
                        onChange={(e) => {
                          setSelectedDurationUnit(e.target.value);
                        }}
                      >
                        <option value="">
                          {language === "en"
                            ? "Select Duration Unit"
                            : "اختر وحدة المدة"}
                        </option>
                        <option>{language === "en" ? "Day" : "يوم"}</option>
                        <option>{language === "en" ? "Week" : "أسبوع"}</option>
                        <option>{language === "en" ? "Month" : "شهر"}</option>
                        <option>{language === "en" ? "Year" : "سنة"}</option>
                      </select>

                      <button
                        onClick={() =>
                          handleDuration(
                            selectedDuration,
                            selectedDurationUnit,
                            application_id,
                            applicationData.applicationInfo[0]
                              .The_User_Who_work_on_The_Application_id
                          )
                        }
                        disabled={
                          !selectedDuration ||
                          !selectedDurationUnit ||
                          selectedDuration <= 0
                        }
                      >
                        Assign
                      </button>
                    </div>
                  )
                )}
              </td>

              <td>
                {language === "en"
                  ? "Number of Finished Tasks"
                  : "عدد المهام المنتهية"}
              </td>
              <td>{tasks.completed[0]?.The_number_of_Completed_Tasks}</td>
              <td>
                {language === "en"
                  ? "User Who Work on the Application"
                  : "المستخدم الذي يعمل علي التطبيق"}
              </td>
              <td>
                {applicationData.applicationInfo[0]
                  ?.The_User_Who_Work_on_The_Application ? (
                  Number(userGroup) !== 3 &&
                  userDepartment ===
                    applicationData.applicationInfo[0]
                      .Application_department_id ? (
                    <div className="select_employee">
                      {
                        applicationData.applicationInfo[0]
                          ?.The_User_Who_Work_on_The_Application
                      }
                      <div>
                        <select
                          value={selectedEmployee}
                          onChange={(e) => {
                            setSelectedEmployee(e.target.value);
                          }}
                        >
                          <option value="">
                            {language === "en"
                              ? "Select Employee"
                              : "اختر موظف"}
                          </option>
                          {employees.map((employee) => (
                            <option
                              key={employee.user_id}
                              value={employee.user_id}
                            >
                              {employee.Employee_Full_Name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleReAssignUser(
                              applicationData.applicationInfo[0]
                                .The_User_Who_work_on_The_Application_id,
                              selectedEmployee,
                              application_id
                            )
                          }
                          disabled={!selectedEmployee}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ) : (
                    applicationData.applicationInfo[0]
                      ?.The_User_Who_Work_on_The_Application
                  )
                ) : (
                  Number(userGroup) !== 3 &&
                  userDepartment ===
                    applicationData.applicationInfo[0]
                      .Application_department_id &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    1 &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    2 &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    4 &&
                  applicationData.applicationInfo[0].Application_State_id !==
                    6 && (
                    <div>
                      <select
                        value={selectedEmployee}
                        onChange={(e) => {
                          setSelectedEmployee(e.target.value);
                        }}
                      >
                        <option value="">
                          {language === "en" ? "Select Employee" : "اختر موظف"}
                        </option>
                        {employees.map((employee) => (
                          <option
                            key={employee.user_id}
                            value={employee.user_id}
                          >
                            {employee.Employee_Full_Name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          handleAssignUser(selectedEmployee, application_id)
                        }
                        disabled={!selectedEmployee}
                      >
                        Assign
                      </button>
                    </div>
                  )
                )}
              </td>
            </tr>
            <tr>
              <td>{language === "en" ? "End Date" : "تاريخ الانتهاء"}</td>

              <td>
                {applicationData.applicationInfo[0]?.Application_End_Date}
              </td>

              <td>
                {language === "en"
                  ? "Number of Unfinished Tasks"
                  : "عدد المهام الغير منتهية"}
              </td>
              <td>{tasks.uncompleted[0]?.The_number_of_Uncompleted_Tasks}</td>

              <td>
                {language === "en"
                  ? "User Who Approve the Application"
                  : "المستخدم الذي وافق علي التطبيق"}
              </td>
              <td>
                {applicationData.applicationInfo[0]
                  ?.The_User_Who_Approved_The_Application ? (
                  applicationData.applicationInfo[0]
                    ?.The_User_Who_Approved_The_Application
                ) : userGroup !== "3" &&
                  userDepartment ===
                    applicationData.applicationInfo[0]
                      .Application_department_id &&
                  applicationData.applicationInfo[0]?.Application_State_id ===
                    1 ? (
                  <div>
                    <button onClick={() => handleApprove()}>
                      {language === "en" ? "Approv" : "موافقة"}
                    </button>
                    <button onClick={() => handleDecline()}>
                      {language === "en" ? "Decline" : "رفض"}
                    </button>
                  </div>
                ) : (
                  applicationData.applicationInfo[0]
                    ?.The_User_Who_Approved_The_Application
                )}
                {Number(userGroup) !== 3 &&
                applicationData.applicationInfo[0]?.Application_State_id ===
                  1 &&
                applicationData.applicationInfo[0]
                  ?.The_User_Who_request_The_Application_id ===
                  Number(user_Id) ? (
                  <button onClick={() => handlecancle()}>
                    {language === "en" ? "Cancle" : "إلغاء"}
                  </button>
                ) : (
                  ""
                )}
              </td>
            </tr>
            <tr>
              <td>{language === "en" ? "Description" : "الوصف"}</td>
              <td colSpan="3">
                {applicationData.applicationInfo[0]?.Application_Description}
              </td>
              <td>
                {language === "en" ? "Application Status" : "حالة التطبيق"}
              </td>
              <td colSpan="2" className="Application_status">
                {applicationData.applicationInfo[0]?.Application_State}
                {userGroup !== "3" &&
                  userDepartment ===
                    applicationData.applicationInfo[0]
                      .Application_department_id &&
                  applicationData.applicationInfo[0]?.Application_State !==
                    "requested" && (
                    <div>
                      <select
                        value={selectedEmployee}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                        }}
                      >
                        <option value="">
                          {language === "en"
                            ? "Select Application State"
                            : "اختر حالة التطبيق"}
                        </option>
                        {userGroup === "3" && (
                          <option value="2">
                            {language === "en" ? "canceled" : "إلغاء"}
                          </option>
                        )}
                        {
                          <option value="3">
                            {language === "en" ? "approved" : "قبول"}
                          </option>
                        }
                        {
                          <option value="4">
                            {language === "en" ? "rejected" : "رفض"}
                          </option>
                        }
                        {
                          <option value="5">
                            {language === "en" ? "inprogress" : "قيد العمل"}
                          </option>
                        }
                        {
                          <option value="6">
                            {language === "en" ? "completed" : "إكتمل"}
                          </option>
                        }
                      </select>

                      <button
                        onClick={() => handleChanageApplicationState()}
                        disabled={!selectedState}
                      >
                        Change
                      </button>
                    </div>
                  )}
              </td>
            </tr>
            {pdfsPath[0] !== null && (
              <tr>
                <select onChange={(e) => setSelectedPdf(e.target.value)}>
                  <option value="">
                    {language === "en" ? "Select a PDF" : "أختر الملف"}
                  </option>
                  {pdfsPath.map((pdf) => (
                    <option key={pdf} value={pdf}>
                      {pdf?.slice(9, pdf.length)}
                    </option>
                  ))}
                </select>
                <button onClick={openModal} disabled={!selectedPdf}>
                  {language === "en" ? "View PDF" : "عرض الملف"}
                </button>
              </tr>
            )}
          </tbody>
        </table>
        <PDFViewer
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          pdfPath={selectedPdf}
        />
      </div>
      <div className="Application_meetings">
        <h2>{language === "en" ? "Meetings" : "الاجتماعات"}</h2>
        <table className="Application_table">
          <tbody>
            <th>
              <label>
                {language === "en" ? `Meeting Number` : `رقم الاجتماع`}
              </label>
            </th>
            <th>
              <label>
                {language === "en" ? `Meeting Link` : `رابط الاجتماع`}
              </label>
            </th>
            <th>
              <label>
                {language === "en"
                  ? `meeting important points`
                  : `أهم نقاط الأجتماع`}
              </label>
            </th>
            <th>
              <label>
                {language === "en"
                  ? `User Who Request or cancel Meeting`
                  : `الشخص الذي طلب او ألغاه الإجتماع`}
              </label>
            </th>
            <th>
              <label>
                {language === "en"
                  ? `Meeting Start Date`
                  : `معاد بداية الإجتماع`}
              </label>
            </th>
            <th>
              <label>
                {language === "en" ? `Meeting Status` : `حاله الإجتماع`}
              </label>
            </th>
            {applicationData.meetings.map((meeting, index) => (
              <tr key={index}>
                <td>
                  <label>
                    {language === "en"
                      ? `Meeting ${index + 1}`
                      : `الاجتماع ${index + 1}`}
                  </label>
                </td>
                <td>
                  <a
                    href={meeting.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {meeting.Meeting_Status === "completed"
                      ? meeting.meeting_link
                        ? language === "en"
                          ? `Meeting ${index + 1}`
                          : `الاجتماع ${index + 1}`
                        : language === "en"
                        ? `Meeting ${
                            index + 1
                          } was offline meeting in meeting room`
                        : `الاجتماع ${index + 1} كان في قاعة الاجتماعات`
                      : meeting.Meeting_Status === "inprogress"
                      ? meeting.meeting_link
                        ? language === "en"
                          ? `Meeting ${index + 1}`
                          : `الاجتماع ${index + 1}`
                        : language === "en"
                        ? `Meeting ${
                            index + 1
                          } is offline meeting in meeting room`
                        : `الاجتماع ${index + 1} في قاعة الاجتماعات`
                      : meeting.Meeting_Status === "rejected"
                      ? meeting.meeting_link
                        ? language === "en"
                          ? `Meeting ${
                              index + 1
                            } was rejected and this would be the link`
                          : `الاجتماع ${index + 1}  تم رفضه و هذا كان الرابط `
                        : language === "en"
                        ? `Meeting ${
                            index + 1
                          } would be offline meeting in meeting room`
                        : `الاجتماع ${index + 1} كان سيقام في قاعة الاجتماعات`
                      : meeting.Meeting_Status === "approved"
                      ? meeting.meeting_link
                        ? language === "en"
                          ? `Meeting ${
                              index + 1
                            } was approved and this will be the link`
                          : `الاجتماع ${index + 1}  تم رفضه و هذا سيكون الرابط `
                        : language === "en"
                        ? `Meeting ${
                            index + 1
                          } will be offline meeting in meeting room`
                        : `الاجتماع ${index + 1} سيقام في قاعة الاجتماعات`
                      : meeting.Meeting_Status === "canceled"
                      ? meeting.meeting_link
                        ? language === "en"
                          ? `Meeting ${
                              index + 1
                            } was canceled and this would be the link`
                          : `الاجتماع ${index + 1}  تم إلغائه و هذا كان الرابط `
                        : language === "en"
                        ? `Meeting ${
                            index + 1
                          } will be offline meeting in meeting room`
                        : `الاجتماع ${index + 1} كان سيقام في قاعة الاجتماعات`
                      : meeting.Meeting_Status === "requested"
                      ? meeting.meeting_link
                        ? language === "en"
                          ? `Meeting ${
                              index + 1
                            } was requested and this will be the link`
                          : `الاجتماع ${index + 1}  تم طلبه و هذا سيكون الرابط `
                        : language === "en"
                        ? `Meeting ${
                            index + 1
                          } will be offline meeting in meeting room`
                        : `الاجتماع رقم ${
                            index + 1
                          }  سيقام في قاعة الاجتماعات رقم ${
                            meeting.meeting_location_id ?? ""
                          }`
                      : ""}
                  </a>
                </td>
                <td>{meeting.meeting_important_points}</td>
                <td>{meeting.User_Who_Request_Meeting}</td>
                <td>{meeting.Meeting_Start_Date}</td>
                <td>
                  {!meeting.is_approve ||
                  (meeting.is_approve &&
                    meeting.user_id !== Number(user_Id)) ? (
                    <div>
                      <button
                        onClick={() => handleApproveMeeting(meeting.meeting_id)}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeclineMeeting(meeting.meeting_id)}
                      >
                        Decline
                      </button>
                    </div>
                  ) : meeting.is_approve === "y" ? (
                    <p>Approved</p>
                  ) : (
                    <p>Declined</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleMeetingClick}>
          {language === "en" ? "Create New Meeting" : "إنشاء اجتماع جديد"}
        </button>
      </div>
      {userDepartment ===
        (applicationData.applicationInfo[0].Application_department_id ||
          (Number(userGroup) !== 2 &&
            (applicationData.applicationInfo[0].Application_State_id !== 1 ||
              applicationData.applicationInfo[0].Application_State_id !== 2 ||
              applicationData.applicationInfo[0].Application_State_id !==
                4))) && (
        <div>
          <h2>{language === "en" ? "Tasks" : "المهام"}</h2>
          <div className="Application_taskGrid">
            <div className="Application_MyAppTasks">
              <div className="Application_cardsRow">
                <div
                  className={`TaskCard ${
                    isDarkMode ? "TaskCard_dark" : "TaskCard_light"
                  }`}
                  onClick={() =>
                    navigate("/RequestTask", { state: { application_id } })
                  }
                >
                  <Plus size={50} className="plus_Icon" />
                </div>
                {applicationData.tasksDetails.length > 0 ? (
                  applicationData.tasksDetails.map((task, index) => (
                    <TaskCard
                      key={index}
                      task={task}
                      onClick={() => {
                        toggleCard(index);
                      }}
                      task_id={task.task_id}
                      activecard={activeCards[index]}
                    />
                  ))
                ) : (
                  <p className="Application_noTasks">
                    {language === "en" ? "No Tasks available" : "لا توجد مهام"}
                  </p>
                )}
              </div>

              {applicationData.tasksDetails.some(
                (_, index) => activeCards[index]
              ) && (
                <div className="Application_details">
                  <table className="Application_table">
                    <tbody>
                      <tr>
                        <td>
                          {language === "en" ? "Start Date" : "تاريخ البدء"}
                        </td>
                        <td>
                          {
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.Task_Start_Date
                          }
                        </td>
                        <td>
                          {language === "en"
                            ? "User Who Requested the Task"
                            : "المستخدم الذي طلب المهمة"}
                        </td>
                        <td>
                          {
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.The_User_Who_Requested_The_Task
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>{language === "en" ? "Duration" : "المدة"}</td>
                        <td>
                          {applicationData.tasksDetails.find(
                            (_, index) => activeCards[index]
                          )?.Task_Duration ? (
                            userGroup !== "3" ? (
                              <div className="select_employee">
                                {
                                  applicationData.tasksDetails.find(
                                    (_, index) => activeCards[index]
                                  )?.Task_Duration
                                }
                                <div>
                                  <input
                                    type="number"
                                    onChange={(e) =>
                                      setSelectedDurationforTask(e.target.value)
                                    }
                                  />
                                  <select
                                    value={selectedDurationUnit}
                                    onChange={(e) => {
                                      setSelectedDurationUnitforTask(
                                        e.target.value
                                      );
                                    }}
                                  >
                                    <option value="">
                                      {language === "en"
                                        ? "Select Duration Unit"
                                        : "اختر وحدة المدة"}
                                    </option>
                                    <option>
                                      {language === "en" ? "Day" : "يوم"}
                                    </option>
                                    <option>
                                      {language === "en" ? "Week" : "أسبوع"}
                                    </option>
                                    <option>
                                      {language === "en" ? "Month" : "شهر"}
                                    </option>
                                    <option>
                                      {language === "en" ? "Year" : "سنة"}
                                    </option>
                                  </select>

                                  <button
                                    onClick={() =>
                                      handleChanageTaskDuration(
                                        selectedDurationforTask,
                                        selectedDurationUnitforTask,
                                        applicationData.tasksDetails.find(
                                          (_, index) => activeCards[index]
                                        )?.task_id
                                      )
                                    }
                                    disabled={
                                      !selectedDurationforTask ||
                                      !selectedDurationUnitforTask ||
                                      selectedDurationforTask <= 0 ||
                                      getDateDifference(
                                        applicationData.applicationInfo
                                          .Application_End_Date,
                                        getDateAdding(
                                          selectedDurationforTask,
                                          selectedDurationUnitforTask
                                        )
                                      ) > 0
                                    }
                                  >
                                    {language === "en"
                                      ? "Chanage Duration"
                                      : "تغير المدة"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              applicationData.tasksDetails.find(
                                (_, index) => activeCards[index]
                              )?.Task_Duration
                            )
                          ) : (
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.Task_Status_id !== 2 &&
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.Task_Status_id !== 4 &&
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.Task_Status_id !== 6 && (
                              <div>
                                <input
                                  type="number"
                                  onChange={(e) =>
                                    setSelectedDurationforTask(e.target.value)
                                  }
                                />
                                <select
                                  value={selectedDurationUnitforTask}
                                  onChange={(e) => {
                                    setSelectedDurationUnitforTask(
                                      e.target.value
                                    );
                                  }}
                                >
                                  <option value="">
                                    {language === "en"
                                      ? "Select Duration Unit"
                                      : "اختر وحدة المدة"}
                                  </option>
                                  <option>
                                    {language === "en" ? "Day" : "يوم"}
                                  </option>
                                  <option>
                                    {language === "en" ? "Week" : "أسبوع"}
                                  </option>
                                  <option>
                                    {language === "en" ? "Month" : "شهر"}
                                  </option>
                                  <option>
                                    {language === "en" ? "Year" : "سنة"}
                                  </option>
                                </select>

                                <button
                                  onClick={() =>
                                    handleDurationforTask(
                                      selectedDurationforTask,
                                      selectedDurationUnitforTask,
                                      applicationData.tasksDetails.find(
                                        (_, index) => activeCards[index]
                                      )?.task_id
                                    )
                                  }
                                  disabled={
                                    !selectedDurationforTask ||
                                    !selectedDurationUnitforTask ||
                                    selectedDurationforTask <= 0 ||
                                    getDateDifference(
                                      applicationData.applicationInfo
                                        .Application_End_Date,
                                      getDateAdding(
                                        selectedDurationforTask,
                                        selectedDurationUnitforTask
                                      )
                                    ) < 0
                                  }
                                >
                                  {language === "en"
                                    ? "Assign Duration"
                                    : "تعيين المدة"}
                                </button>
                              </div>
                            )
                          )}
                        </td>
                        <td>
                          {language === "en"
                            ? "User Who Work on the Task"
                            : "المستخدم الذي يعمل علي المهمة"}
                        </td>
                        <td>
                          {applicationData.tasksDetails.find(
                            (_, index) => activeCards[index]
                          )?.The_User_Who_Work_On_This_Task
                            ? applicationData.tasksDetails[0]
                                ?.The_User_Who_Work_On_This_Task
                            : userGroup !== "3" &&
                              applicationData.tasksDetails[0].Task_Status !==
                                1 &&
                              applicationData.tasksDetails[0].Task_Status !==
                                2 &&
                              applicationData.tasksDetails[0].Task_Status !==
                                4 &&
                              applicationData.tasksDetails[0].Task_Status !==
                                6 && (
                                <div>
                                  <select
                                    value={selectedEmployeeforTask}
                                    onChange={(e) => {
                                      setSelectedEmployeeforTask(
                                        e.target.value
                                      );
                                    }}
                                  >
                                    <option value="">
                                      {language === "en"
                                        ? "Select Employee"
                                        : "اختر موظف"}
                                    </option>
                                    {difference
                                      .filter(
                                        (employee) =>
                                          employee.user_id !==
                                          applicationData.applicationInfo[0]
                                            .The_User_Who_work_on_The_Application_id
                                      )

                                      .map((employee) => (
                                        <option
                                          key={employee.user_id}
                                          value={employee.user_id}
                                        >
                                          {employee.Employee_Full_Name}
                                        </option>
                                      ))}
                                  </select>

                                  <button
                                    onClick={() =>
                                      handleAssignUsertoTask(
                                        selectedEmployeeforTask,
                                        applicationData.tasksDetails.find(
                                          (_, index) => activeCards[index]
                                        ).task_id,
                                        application_id
                                      )
                                    }
                                    disabled={!selectedEmployeeforTask}
                                  >
                                    Assign
                                  </button>
                                </div>
                              )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {language === "en" ? "End Date" : "تاريخ الانتهاء"}
                        </td>
                        <td>
                          {
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.Task_End_Date
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>{language === "en" ? "Description" : "الوصف"}</td>
                        <td colSpan="5">
                          {
                            applicationData.tasksDetails.find(
                              (_, index) => activeCards[index]
                            )?.The_Task_Description
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Application;
