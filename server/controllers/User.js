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
      return res.status(200).json({ Status: true, User });
    } catch (error) {
      console.error("Error fetching Users:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async ApproveAccounts(req, res) {
    try {
      const user_id = Number(req.body.user_id);
      const Approve = await UsersModel.ApproveAccounts(user_id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error Approveing User:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
  static async DeclineAccounts(req, res) {
    const user_id = Number(req.body.user_id);
    try {
      const Decline = await UsersModel.DeclineAccounts(user_id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error Decline User:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
}

module.exports = UsersController;
