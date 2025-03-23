const UsersModel = require("../models/Users");

class UsersController {
  static async getAllUsers(req, res) {
    try {
      const Users = await UsersModel.getAllUsers();
      res.json(Users);
    } catch (error) {
      console.error("Error fetching Users:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getOneUser(req, res) {
    const { User_id } = req.body;
    try {
      const User = await UsersModel.getOneUser(User_id);
      res.json(User);
    } catch (error) {
      console.error("Error fetching User:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async addUser(req, res) {
    const {
      user_fname,
      user_lname,
      user_phone,
      user_email,
      user_password,
      user_branch_id,
      user_department_id,
    } = req.body;
    try {
      if (
        !user_fname ||
        !user_lname ||
        !user_phone ||
        !user_email ||
        !user_password ||
        !user_branch_id ||
        !user_department_id
      )
        return res
          .status(404)
          .json({ Status: "Error", Message: "Their is empty data" });

      const isExist = await UsersModel.getUserByEmail(user_email);
      if (isExist)
        return res
          .status(404)
          .json({ Status: "Error", Message: "User is exist" });

      await UsersModel.addUser(
        user_fname,
        user_lname,
        user_phone,
        user_email,
        user_password,
        user_branch_id,
        user_department_id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error adding User:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  static async GetAllEmployeeWithSpacificUser(req, res) {
    const { user_Id } = req.body;
    try {
      const User = await UsersModel.GetAllEmployeeWithSpacificUser(user_Id);
      return res.status(200).json({ Status: "Success", User });
    } catch (error) {
      console.error("Error fetching Users:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      if (!id)
        return res
          .status(404)
          .json({ Status: "Error", Message: "User ID is empty" });

      const isExist = await UsersModel.deleteUser(id);
      if (isExist.length === 0)
        return res
          .status(404)
          .json({ Status: "Error", Message: "USer is not exist" });

      await BranchesModel.deleteBranche(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting User:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
}

module.exports = UsersController;
