import axios from "./axios";

const GetAllDepartments = () => axios.get("/departments");
const DepartmentAPI = {
  GetAllDepartments,
};

export default DepartmentAPI;
