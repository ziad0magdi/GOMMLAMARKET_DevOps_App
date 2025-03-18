import axios from "./axios";

const GetAllEmployeeWithSpacificUser = (user_Id) =>
  axios.post("/Employee", { user_Id: user_Id });

const AddUser = (formData) => axios.post("/User", formData);

const UserAPI = {
  GetAllEmployeeWithSpacificUser,
  AddUser,
};
export default UserAPI;
