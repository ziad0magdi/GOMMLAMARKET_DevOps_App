const TaskModel = require("../models/Tasks");

const ApplicationModel = require("../models/Application");

class TaskController {
  static async AddTask(req, res) {
    try {
      if (!req.body.task_request_user_id) {
        return res.status(400).json({ error: "Invalid Request" });
      }

      // Ensure the user ID is correctly parsed as an integer
      const task_request_user_id = Number(req.body.task_request_user_id);
      if (isNaN(task_request_user_id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const application_id = Number(req.body.application_id);
      const pdfFilePath = req.file ? `/uploads/${req.file.filename}` : null;
      const task_description = req.body.task_description;
      const newtask = await TaskModel.addTask(
        task_description,
        task_request_user_id,
        application_id
      );
      if (pdfFilePath) {
        const lastTask = await TaskModel.getLastTaskId();
        const task_id = lastTask[0].application_id
          ? lastTask[0].application_id
          : 1;
        const newTaskFile = await TaskModel.addTaskFile(
          pdfFilePath,
          task_id,
          task_request_user_id
        );
        return res.status(201).json({
          message: "Task File submitted!",
          newTaskFile,
        });
      }

      return res.status(201).json({
        message: "Application request submitted!",
        newtask,
      });
    } catch (error) {
      console.error("Error submitting application request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async AssignDuration(req, res) {
    const { duration, duration_unit, task_id } = req.body;
    let currentDate = parseInt(duration);
    if (duration_unit === "week" || duration_unit === "أسبوع") {
      currentDate = duration * 7;
    } else if (duration_unit === "month" || duration_unit === "شهر") {
      currentDate = duration * 30;
    } else if (duration_unit === "year" || duration_unit === "سنة") {
      currentDate = duration * 365;
    }

    try {
      const result = await TaskModel.AssignDuration(
        duration,
        duration_unit,
        currentDate,
        task_id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Assiging Task:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async changeTaskDuration(req, res) {
    const { duration, duration_unit, task_id } = req.body;
    let currentDate = parseInt(duration);
    if (duration_unit === "week" || duration_unit === "أسبوع") {
      currentDate = duration * 7;
    } else if (duration_unit === "month" || duration_unit === "شهر") {
      currentDate = duration * 30;
    } else if (duration_unit === "year" || duration_unit === "سنة") {
      currentDate = duration * 365;
    }

    try {
      const result = await TaskModel.changeTaskDuration(
        duration,
        duration_unit,
        currentDate,
        task_id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Editing Task:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async AssginTask(req, res) {
    try {
      const user_Id = Number(req.body.user_Id);
      const task_Id = Number(req.body.task_Id);
      const application_id = Number(req.body.application_id);
      if (!user_Id || !task_Id) {
        console.error("Error Assgining Task");
        return res.status(403).json({ error: "Some data is missing" });
      }
      const resuelt = await TaskModel.AssginTask(user_Id, task_Id);
      const resuelt2 = await ApplicationModel.getApplicationStardDate(
        application_id
      );
      const application_start_date = resuelt2[0].application_start_date;
      const application_duration = resuelt2[0].application_duration;
      const application_end_date = resuelt2[0].application_end_date;
      console.log("resuelt2>>>>>>>>>>>>", resuelt2);
      console.log(">>>>>>>>>>>>", application_start_date);
      console.log(">>>>>>>>>>>>", application_duration);
      console.log(">>>>>>>>>>>>", application_end_date);
      const resuelt3 = await ApplicationModel.AssginApplication(
        user_Id,
        application_id,
        application_start_date,
        application_duration,
        application_end_date
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Assgining Task");
      return res.status(500).json({ error: error });
    }
  }
}
module.exports = TaskController;
