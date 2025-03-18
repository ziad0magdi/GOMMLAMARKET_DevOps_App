const db = require("../config/db");

class DepartmentsModel {
  /*------------------------GET ALL Departments----------------------------------------*/
  static async getAllDepartments() {
    try {
      const query = "SELECT * FROM departments";
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching departments:", err);
      throw err;
    }
  }

  /*------------------------GET ALL Departments IDs----------------------------------------*/
  static async getDepartmentsIDs() {
    try {
      const query = "SELECT department_id FROM departments";
      const result = await db.executeQuery(query); // Use the executeQuery method
      return result.recordset; // `recordset` contains the result rows from mssql
    } catch (err) {
      console.error("Error fetching departments:", err);
      throw err;
    }
  }

  /*------------------------GET A SPACIFIC Department BY Department id-------------------------*/
  static async getDepartmentbyid(department_id) {
    try {
      const query =
        "SELECT * FROM departments WHERE department_id = @department_id"; // Use parameterized query
      const params = {
        department_id: department_id,
      };
      const result = await db.executeQuery(query, params); // Execute query with params
      return result.recordset; // Return the department from the recordset
    } catch (err) {
      console.error("Error fetching department:", err);
      throw err;
    }
  }
  /*------------------------GET A SPACIFIC Department BY Department name-------------------------*/
  static async getOneDepartment(departmentName) {
    try {
      const query =
        "SELECT * FROM departments WHERE department_name = @department_name"; // Use parameterized query
      const params = {
        department_name: departmentName,
      };
      const result = await db.executeQuery(query, params); // Execute query with params
      return result.recordset; // Return the department from the recordset
    } catch (err) {
      console.error("Error fetching department:", err);
      throw err;
    }
  }

  /*------------------------ADDING NEW Department---------------------------------------*/
  static async addDeparnment(department_name) {
    try {
      const query =
        "INSERT INTO departments (department_name) VALUES(@Department_name)";
      const params = {
        Department_name: department_name,
      };
      const result = await db.executeQuery(query, params); // Execute query with params
      return result.recordset; // Return the department from the recordset
    } catch (err) {
      console.error("Error fetching department:", err);
      throw err;
    }
  }

  /*------------------------UPDATE Department Name---------------------------------------*/
  static async updateDepartmentName(NewDepartment_name, department_id) {
    try {
      const query =
        "UPDATE departments SET department_name = @NewDepartment_name WHERE department_id = @department_id";
      const params = {
        NewDepartment_name: NewDepartment_name,
        department_id: department_id,
      };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected;
    } catch (err) {
      console.error("Error updating department name:", err);
      throw err;
    }
  }

  /*------------------------DELETE Specific Department----------------------------------*/
  static async deleteDepartment(departmentId) {
    try {
      const query =
        "DELETE FROM departments WHERE department_id = @department_id";
      const params = {
        department_id: departmentId, // Passing the department ID to be deleted
      };
      const result = await db.executeQuery(query, params); // Execute the delete query
      return result.rowsAffected; // Return the number of rows affected
    } catch (err) {
      console.error("Error deleting department:", err);
      throw err;
    }
  }
}

module.exports = DepartmentsModel;
