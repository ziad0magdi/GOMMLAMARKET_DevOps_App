import axios from "./axios";

const AddTask = (formData) =>
  axios.post("/Task", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const AssginTask = (user_Id, task_Id, application_id) =>
  axios.post("/AssginTask", {
    user_Id: user_Id,
    task_Id: task_Id,
    application_id: application_id,
  });

const AssignDuration = (duration, duration_unit, task_id) =>
  axios.post("/AssignTaskDuration", {
    duration: duration,
    duration_unit: duration_unit,
    task_id: task_id,
  });

const changeTaskDuration = (duration, duration_unit, task_id) =>
  axios.post("/changeTaskDuration", {
    duration: duration,
    duration_unit: duration_unit,
    task_id: task_id,
  });

const TaskAPI = {
  AddTask,
  AssginTask,
  AssignDuration,
  changeTaskDuration,
};

export default TaskAPI;
