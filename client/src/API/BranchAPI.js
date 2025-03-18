import axios from "./axios";

const GetAllBranchs = () => axios.get("/branch");

const BranchAPI = {
  GetAllBranchs,
};

export default BranchAPI;
