const BranchesModel = require("../models/Branches");

class BranchesController {
  static async getAllBranchess(req, res) {
    try {
      const Branchess = await BranchesModel.getAllBranches();
      res.json(Branchess);
    } catch (error) {
      console.error("Error fetching Branchess:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getOneBranchess(req, res) {
    const { Branches_name } = req.body;
    try {
      const Branches = await BranchesModel.getOneBranche(Branches_name);
      res.json(Branches);
    } catch (error) {
      console.error("Error fetching Branchess:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async addBranches(req, res) {
    const { branche_name } = req.body;
    try {
      if (!branche_name)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Branches name is empty" });

      const isExist = await BranchesModel.getOneBranche(branche_name);
      if (isExist.length > 0)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Branches is exist" });

      await BranchesModel.addBranches(branche_name);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error adding Branches:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  static async updateBranches(req, res) {
    const { id } = req.params;
    const { Branches_name } = req.body;
    try {
      if (!Branches_name)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Branches name is empty" });

      const isExist = await BranchesModel.getOneBranches(Branches_name);
      if (isExist.length > 0)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Branches is exist" });

      await BranchesModel.updateBrancheName(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating Branches:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async deleteBranches(req, res) {
    const { id } = req.params;
    try {
      if (!id)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Branches ID is empty" });

      const isExist = await BranchesModel.getBranchebyid(id);
      if (isExist.length === 0)
        return res
          .status(404)
          .json({ Status: "Error", Message: "Branches is not exist" });

      await BranchesModel.deleteBranche(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting Branches:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
}

module.exports = BranchesController;
