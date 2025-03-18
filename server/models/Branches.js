const db = require("../config/db");

class BranchesModel {
  /*------------------------GET ALL Branches----------------------------------------*/
  static async getAllBranches() {
    try {
      const query = "SELECT * FROM branches";
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Branches:", err);
      throw err;
    }
  }

  /*------------------------GET ALL Branches IDs----------------------------------------*/
  static async getBranchesIDs() {
    try {
      const query = "SELECT branch_id FROM branches";
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Branches:", err);
      throw err;
    }
  }

  /*------------------------GET A SPACIFIC Branche BY Branche id-------------------------*/
  static async getBranchebyid(branch_id) {
    try {
      const query = "SELECT * FROM branches WHERE branch_id = @branch_id";
      const params = {
        branch_id: branch_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Branche:", err);
      throw err;
    }
  }
  /*------------------------GET A SPACIFIC Branche BY Branche name-------------------------*/
  static async getOneBranche(branch_name) {
    try {
      const query = "SELECT * FROM branches WHERE branch_name = @branch_name";
      const params = {
        branch_name: branch_name,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Branche:", err);
      throw err;
    }
  }

  /*------------------------ADDING NEW Branche---------------------------------------*/
  static async addBranches(branch_name) {
    try {
      const query = "INSERT INTO branches (branch_name) VALUES(@branch_name)";
      const params = {
        branch_name: branch_name,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Branche:", err);
      throw err;
    }
  }

  /*------------------------UPDATE Branche Name---------------------------------------*/
  static async updateBrancheName(Newbranche_name, branch_id) {
    try {
      const query =
        "UPDATE branches SET branch_name = @Newbranche_name WHERE branch_id = @branch_id";
      const params = {
        Newbranche_name: Newbranche_name,
        branch_id: branch_id,
      };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected;
    } catch (err) {
      console.error("Error updating Branche name:", err);
      throw err;
    }
  }

  /*------------------------DELETE Specific Branche----------------------------------*/
  static async deleteBranche(branch_id) {
    try {
      const query = "DELETE FROM branches WHERE branch_id = @branch_id";
      const params = {
        branch_id: branch_id,
      };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected;
    } catch (err) {
      console.error("Error deleting Branche:", err);
      throw err;
    }
  }
}

module.exports = BranchesModel;
