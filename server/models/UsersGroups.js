const db = require("../config/db");

class UsersGroupsModel {
  /*-------------------------------Get All users Groups (Permisions)-----------------------------*/
  static async getAllGroups() {
    try {
      const query = "SELECT * FROM users_groups";
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Users Groups:", err);
      throw err;
    }
  }

  /*-------------------------------Get User Group By Its Role-------------------------------------*/
  static async getGroupByRole(group_role) {
    try {
      const query = "SELECT * FROM users_groups WHERE group_role = @group_role";
      const params = {
        group_role: group_role,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching User Group:", err);
      throw err;
    }
  }

  /*-------------------------------Get User Group By Its id-------------------------------------*/
  static async getGroupByid(group_id) {
    try {
      const query = "SELECT * FROM users_groups WHERE group_id = @group_id";
      const params = {
        group_id: group_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching User Group:", err);
      throw err;
    }
  }

  /*--------------------------------Add User Group------------------------------------------------*/
  static async addUserGroup(group_role, group_privilege) {
    try {
      const query =
        "INSERT INTO users_groups (group_role, group_privilege) VALUES(@group_role, @group_privilege)";
      const params = {
        group_role: group_role,
        group_privilege: group_privilege,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding User Group:", err);
      throw err;
    }
  }

  /*--------------------------------Update User Group------------------------------------------------*/
  // static async updateUserGroup(Newgroup_role, Newgroup_privilege, group_id) {
  //   try {
  //     const query =
  //       "UPDATE users_groups SET group_role = @group_role ,group_privilege = @group_privilege WHERE group_id = @group_id";
  //     const params = {
  //       group_role: Newgroup_role,
  //       group_privilege: Newgroup_privilege,
  //       group_id: group_id,
  //     };
  //     const result = await db.executeQuery(query, params);
  //     return result.recordset;
  //   } catch (err) {
  //     console.error("Error Updating User Group:", err);
  //     throw err;
  //   }
  // }

  /*-------------------------------Delete User Group By Its Role-------------------------------------*/
  static async deleteGroupByRole(group_role) {
    try {
      const query = "DELETE FROM users_groups WHERE group_role = @group_role";
      const params = {
        group_role: group_role,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Deleting User Group:", err);
      throw err;
    }
  }
}
module.exports = UsersGroupsModel;
