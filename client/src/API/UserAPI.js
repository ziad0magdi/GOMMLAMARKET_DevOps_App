import axios from "./axios";

const GetAllEmployeeWithSpacificUser = (user_Id) =>
  axios.post("/Employee", { user_Id: user_Id });

const AddUser = (formData) => axios.post("/User", formData);
const ApproveAccounts = (user_id) =>
  axios.post("/ApproveAccounts", { user_id: user_id });
const DeclineAccounts = (user_id) =>
  axios.post("/DeclineAccounts", { user_id: user_id });

const UserAPI = {
  GetAllEmployeeWithSpacificUser,
  AddUser,
  ApproveAccounts,
  DeclineAccounts,
};
export default UserAPI;
