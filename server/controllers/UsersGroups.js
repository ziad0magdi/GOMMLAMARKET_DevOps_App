const UsersGroupsModel = require("../models/UsersGroups");

class UsersGroupsController {
  static async getAllUsersGroups(req, res) {
    try {
      const usersGroups = await UsersGroupsModel.getAllGroups();
      res.json(usersGroups);
    } catch (error) {
      console.error("Error fetching Users Groups:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async addUserGroup(req, res) {
    const { group_role, group_privilege } = req.body;
    try {
      if (!group_role) {
        return res.status(404).json({
          Status: "Error",
          Message: "group role is empty",
        });
      }
      if (!group_privilege) {
        return res.status(404).json({
          Status: "Error",
          Message: "group privilege is empty",
        });
      }
      const isExist = await UsersGroupsModel.getGroupByRole(group_role);
      if (isExist.length > 0)
        return res
          .status(404)
          .json({ Status: "Error", Message: "group role already exist" });

      await UsersGroupsModel.addUserGroup(group_role, group_privilege);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error adding user group:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }
  /*----------------------------------------------------------------------------------------- */
  // static async updateUserGroup(req, res) {
  //   const { group_role, group_privilege } = req.body;
  //   try {
  //     if (!group_role) {
  //       return res.status(404).json({
  //         Status: "Error",
  //         Message: "group role is empty",
  //       });
  //     }
  //     if (!group_privilege) {
  //       return res.status(404).json({
  //         Status: "Error",
  //         Message: "group privilege is empty",
  //       });
  //     }
  //     const isExist = await UsersGroupsModel.getGroupByRole(group_role);
  //     if (isExist?.length > 0)
  //       return res
  //         .status(404)
  //         .json({ Status: "Error", Message: "group role already exist" });

  //     await UsersGroupsModel.addUserGroup(group_role, group_privilege);
  //     return res.json({ success: true });
  //   } catch (error) {
  //     console.error("Error adding user group:", error);
  //     return res.status(500).json({ message: "Server Error", error });
  //   }
  // }
  /*----------------------------------------------------------------------------------------- */

  static async deleteUserGroup(req, res) {
    const { group_role } = req.body;
    try {
      if (!group_role)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Group role is empty" });

      const isExist = await UsersGroupsModel.getGroupByRole(group_role);
      if (isExist.length === 0) {
        return res
          .status(404)
          .json({ Status: "Error", Message: "group role not exist" });
      }
      const result = await UsersGroupsModel.deleteGroupByRole(group_role);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting User group:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
}

module.exports = UsersGroupsController;
