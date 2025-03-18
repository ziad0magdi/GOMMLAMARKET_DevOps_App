import axios from "./axios";
const getAllApplications = () => axios.get("/Application");
const getAllApplicationsinformations = (id, user_Id) =>
  axios.post(`/Application/${id}`, { user_Id: user_Id });

const getAllUserApplications = (user_Id) =>
  axios.post(`/MyApplication`, { user_Id: user_Id });

const AssginApplication = (user_Id, application_Id) =>
  axios.post("/AssginApplication", {
    user_Id: user_Id,
    application_Id: application_Id,
  });
const ChanageAssginApplication = (olduser_Id, user_Id, application_Id) =>
  axios.post("/ReAssginApplication", {
    olduser_Id: olduser_Id,
    user_Id: user_Id,
    application_Id: application_Id,
  });

const CancleApplication = (application_Id) =>
  axios.post("/CancleApplication", { application_Id: application_Id });

const ApproveApplication = (application_approved_user_id, application_Id) =>
  axios.post("/ApproveApplication", {
    application_approved_user_id: application_approved_user_id,
    application_Id: application_Id,
  });

const DeclineApplication = (application_approved_user_id, application_Id) =>
  axios.post("/DeclineApplication", {
    application_approved_user_id: application_approved_user_id,
    application_Id: application_Id,
  });

const ChanageApplicationState = (application_status_id, application_Id) =>
  axios.post("/ChanageApplicationState", {
    application_status_id: application_status_id,
    application_Id: application_Id,
  });

const AssginDuration = (duration, duration_unit, application_Id, user_Id) =>
  axios.post("/AssginDuration", {
    duration: duration,
    duration_unit: duration_unit,
    application_Id: application_Id,
    user_Id: user_Id,
  });
const AddApplications = (formData) =>
  axios.post("Application", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const ChanageApplicationDuration = (duration, duration_unit, application_id) =>
  axios.post("/ChanageApplicationDuration", {
    duration: duration,
    duration_unit: duration_unit,
    application_id: application_id,
  });

const ApplicationAPI = {
  getAllApplications,
  getAllApplicationsinformations,
  getAllUserApplications,
  CancleApplication,
  ApproveApplication,
  DeclineApplication,
  AssginApplication,
  AssginDuration,
  ChanageAssginApplication,
  AddApplications,
  ChanageApplicationState,
  ChanageApplicationDuration,
};

export default ApplicationAPI;
