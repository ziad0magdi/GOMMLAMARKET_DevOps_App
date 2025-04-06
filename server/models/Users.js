const db = require("../config/db");
const bcrypt = require("bcryptjs");
class UsersModel {
  /*----------------------------Get All Users----------------------------------*/
  static async getAllUsers() {
    try {
      const query = "SELECT * FROM users";
      const result = await db.executeQuery(query);
      return result.recordset; // Return all users
    } catch (err) {
      console.error("Error fetching all users:", err);
      throw err;
    }
  }

  /*----------------------------Get One User----------------------------------*/
  static async getOneUser(userId) {
    try {
      const query = "SELECT * FROM users WHERE user_id = @user_id";
      const params = { user_id: userId };
      const result = await db.executeQuery(query, params);
      return result.recordset[0]; // Return a single user
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  /*----------------------------Get One User By Email And Password--------------*/
  static async getUserByEmail(user_email) {
    try {
      const query =
        "SELECT user_email FROM users WHERE user_email = @user_email";
      const params = {
        user_email: user_email,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset[0];
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  /*----------------------------Get One User By Email And Password--------------*/
  static async getUserPasswordByEmail(user_email) {
    try {
      const query =
        "SELECT user_password FROM users WHERE user_email = @user_email";
      const params = {
        user_email: user_email,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset[0];
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  /*----------------------------Get One User information By Email And Password--------------*/
  static async getUserInfoByEmail(user_email) {
    try {
      const query = "SELECT * FROM users WHERE user_email = @user_email";
      const params = {
        user_email: user_email,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset[0];
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  /*----------------------------Get All Employee In the same Department as the Manager-----------------------------*/
  static async GetAllEmployeeWithSpacificUser(user_id) {
    try {
      const query = `SELECT 
      U.user_id,
      U.user_fname + ' ' + user_lname AS 'Employee_Full_Name',
      U.user_phone,
      U.isApproved,
	  UG.group_role
FROM users AS U
INNER JOIN users_groups AS UG
ON U.user_group_id = UG.group_id
WHERE (user_department_id = (SELECT user_department_id FROM users WHERE user_id = @user_id)
 AND user_branch_id = (SELECT user_branch_id FROM users WHERE user_id = @user_id))
  AND user_id <> @user_id`;
      const params = {
        user_id: user_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching users:", err);
      throw err;
    }
  }

  /*----------------------------Update User----------------------------------*/
  static async updateUser(
    newuser_fname,
    newuser_lname,
    newuser_phone,
    newuser_email,
    newuser_branch_id,
    newuser_department_id,
    newuser_group_id,
    user_id
  ) {
    try {
      const query = `
        UPDATE users
        SET 
          user_fname = @newuser_fname,
          user_lname = @newuser_lname,
          user_phone = @newuser_phone,
          user_email = @newuser_email,
          user_branch_id = @newuser_branch_id,
          user_department_id = @newuser_department_id,
          user_group_id = @newuser_group_id
        WHERE user_id = @user_id`;

      const params = {
        newuser_fname,
        newuser_lname,
        newuser_phone,
        newuser_email,
        newuser_branch_id,
        newuser_department_id,
        newuser_group_id,
        user_id,
      };

      const result = await db.executeQuery(query, params);
      return result.rowsAffected; // Return the number of rows updated
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }

  /*----------------------------Delete User----------------------------------*/
  static async deleteUser(userId) {
    try {
      const query = "DELETE FROM users WHERE user_id = @user_id";
      const params = { user_id: userId };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected; // Return the number of rows deleted
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  }

  /*----------------------------Add New User----------------------------------*/
  static async addUser(
    user_fname,
    user_lname,
    user_phone,
    user_email,
    user_password,
    user_branch_id,
    user_department_id
  ) {
    try {
      const hashedPassword = await bcrypt.hash(user_password, 10);

      const query = `
        INSERT INTO users (user_fname, user_lname, user_phone, user_email, user_password, user_branch_id, user_department_id, user_group_id, isApproved)
        VALUES (@user_fname, @user_lname, @user_phone, @user_email, @user_password, @user_branch_id, @user_department_id, @user_group_id ,@isApproved)`;

      const params = {
        user_fname,
        user_lname,
        user_phone,
        user_email,
        user_password: hashedPassword,
        user_branch_id,
        user_department_id,
        user_group_id: 3,
        isApproved: "n",
      };

      const result = await db.executeQuery(query, params);
      return result.rowsAffected;
    } catch (err) {
      console.error("Error adding user:", err);
      throw err;
    }
  }

  /*----------------------------Approve New Employees Accounts By the Manger----------------------------------*/
  static async ApproveAccounts(user_id) {
    try {
      const query = `UPDATE users 
      SET isApproved = 'y'
      WHERE user_id = @user_id`;
      const params = {
        user_id: user_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  /*----------------------------Decline (DELETE) New Employees Accounts By the Manger----------------------------------*/
  static async DeclineAccounts(user_id) {
    try {
      const query = `DELETE FROM users WHERE user_id = @user_id`;
      const params = {
        user_id: user_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }
}

module.exports = UsersModel;
