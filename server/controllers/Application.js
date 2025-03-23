const ApplicationModel = require("../models/Application");

class ApplicationController {
  static async getAllApplications(req, res) {
    try {
      const Application = await ApplicationModel.getAllApplications();
      console.log(Application);
      res.json(Application);
    } catch (error) {
      console.error("Error fetching Applications:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getAllUserApplications(req, res) {
    const { user_Id } = req.body;
    try {
      const applications = await ApplicationModel.getAllUserApplications(
        user_Id
      );

      if (!applications || applications.length === 0) {
        return res
          .status(404)
          .json({ message: "No applications found for this user." });
      }

      return res.status(200).json({ Status: "Success", applications });
    } catch (error) {
      console.error("Error fetching User Applications:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getApplicationById(req, res) {
    const { id } = req.params;
    try {
      const Application = await ApplicationModel.getApplicationById(id);
      res.json(Application);
    } catch (error) {
      console.error("Error fetching Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getApplicationTasks(req, res) {
    const { id } = req.params;
    try {
      const Application = await ApplicationModel.getApplicationById(id);
      res.json(Application);
    } catch (error) {
      console.error("Error fetching Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getAllApplicationsinformations(req, res) {
    const { id } = req.params;
    const user_id = req.body.user_Id;
    try {
      const applicationInfo =
        await ApplicationModel.getAllApplicationsinformations(id);
      const applicationTasks = await ApplicationModel.getApplicationTasks(id);
      const countOfTasks = await ApplicationModel.getApplicationTasksNumber(id);
      const countOfCompletedTasks =
        await ApplicationModel.getApplicationCompletedTasksNumber(id);
      const countOfUncompletedTasks =
        await ApplicationModel.getApplicationUncompletedTasksNumber(id);
      const applicationMeeting = await ApplicationModel.getApplicationMeeting(
        id,
        user_id
      );

      const result = {
        applicationInfo,
        tasks: {
          total: countOfTasks,
          completed: countOfCompletedTasks,
          uncompleted: countOfUncompletedTasks,
        },
        tasksDetails: applicationTasks,
        meetings: applicationMeeting,
      };

      res.json(result); // Send the combined object as the response
    } catch (error) {
      console.error("Error fetching Application Informations:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getApplicationTasksNumber(req, res) {
    const { id } = req.params;
    try {
      const Application = await ApplicationModel.getApplicationTasksNumber(id);
      res.json(Application);
    } catch (error) {
      console.error("Error fetching Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getApplicationCompletedTasksNumber(req, res) {
    const { id } = req.params;
    try {
      const Application =
        await ApplicationModel.getApplicationCompletedTasksNumber(id);
      res.json(Application);
    } catch (error) {
      console.error("Error fetching Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getApplicationUncompletedTasksNumber(req, res) {
    const { id } = req.params;
    try {
      const Application =
        await ApplicationModel.getApplicationUncompletedTasksNumber(id);
      res.json(Application);
    } catch (error) {
      console.error("Error fetching Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getApplicationWorkOn(req, res) {
    const application_id = Number(req.body.application_id);
    try {
      const ApplicationWorkUser = await ApplicationModel.getApplicationWorkOn(
        application_id
      );
      res.json(ApplicationWorkUser);
    } catch (error) {
      console.error("Error fetching Application User Who Work On:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async AddApplications(req, res) {
    try {
      // Ensure request body exists
      if (!req.body.application_request_user_id) {
        return res.status(400).json({ error: "Invalid Request" });
      }

      // Ensure the user ID is correctly parsed as an integer
      const application_request_user_id = Number(
        req.body.application_request_user_id
      );
      if (isNaN(application_request_user_id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const department_id = Number(req.body.department_id);

      const { application_description } = req.body;
      const pdfFilePath = req.file ? `/uploads/${req.file.filename}` : null;
      // Call the model
      const newApplication = await ApplicationModel.addApplication({
        department_id,
        application_request_user_id,
        application_description,
      });
      if (pdfFilePath) {
        const lastApplication = await ApplicationModel.getLastApplicationId();
        const application_id = lastApplication[0].application_id
          ? lastApplication[0].application_id
          : 0;
        const newApplicationFile = await ApplicationModel.addApplicationFile({
          pdfFilePath,
          application_request_user_id,
          application_id,
        });
        return res.status(201).json({
          message: "Application File submitted!",
          newApplicationFile,
        });
      }

      return res.status(201).json({
        message: "Application request submitted!",
        newApplication,
      });
    } catch (error) {
      console.error("Error submitting application request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async AssginApplication(req, res) {
    const user_Id = Number(req.body.user_Id);
    const application_Id = Number(req.body.application_Id);
    try {
      const result = await ApplicationModel.AssginApplication(
        user_Id,
        application_Id
      );
      const result2 = await ApplicationModel.AssginApplicationState(
        application_Id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Assiging Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async ChanageAssginApplication(req, res) {
    const user_Id = Number(req.body.user_Id);
    const application_Id = Number(req.body.application_Id);
    const olduser_Id = Number(req.body.olduser_Id);
    try {
      const result = await ApplicationModel.ChanageAssginApplication(
        olduser_Id,
        user_Id,
        application_Id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Reassiging Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async cancleApplication(req, res) {
    const application_Id = Number(req.body.application_Id);
    try {
      const result = await ApplicationModel.cancleApplication(application_Id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error cancle The Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async approveApplication(req, res) {
    const application_Id = Number(req.body.application_Id);
    const application_approved_user_id = Number(
      req.body.application_approved_user_id
    );
    try {
      const result = await ApplicationModel.approveApplication(
        application_approved_user_id,
        application_Id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Approving The Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async declineApplication(req, res) {
    const application_Id = Number(req.body.application_Id);
    const application_approved_user_id = Number(
      req.body.application_approved_user_id
    );
    try {
      const result = await ApplicationModel.declineApplication(
        application_approved_user_id,
        application_Id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Declining The Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async chanageApplicationState(req, res) {
    const application_Id = Number(req.body.application_Id);
    const application_status_id = Number(req.body.application_status_id);
    try {
      const result = await ApplicationModel.chanageApplicationState(
        application_status_id,
        application_Id
      );

      return res.json({ success: true });
    } catch (error) {
      console.error("Error Declining The Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async AssignDuration(req, res) {
    const { duration, duration_unit, application_Id, user_Id } = req.body;
    let currentDate = parseInt(duration);
    if (duration_unit === "week" || duration_unit === "أسبوع") {
      currentDate = duration * 7;
    } else if (duration_unit === "month" || duration_unit === "شهر") {
      currentDate = duration * 30;
    } else if (duration_unit === "year" || duration_unit === "سنة") {
      currentDate = duration * 365;
    }

    try {
      const result = await ApplicationModel.AssignDuration(
        duration,
        duration_unit,
        currentDate,
        application_Id,
        user_Id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Assiging Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async ChanageApplicationDuration(req, res) {
    const { duration, duration_unit, application_id } = req.body;
    let currentDate = parseInt(duration);
    if (duration_unit === "week" || duration_unit === "أسبوع") {
      currentDate = duration * 7;
    } else if (duration_unit === "month" || duration_unit === "شهر") {
      currentDate = duration * 30;
    } else if (duration_unit === "year" || duration_unit === "سنة") {
      currentDate = duration * 365;
    }

    try {
      const result = await ApplicationModel.ChanageApplicationDuration(
        duration,
        duration_unit,
        currentDate,
        application_id
      );
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Editing Application Duration:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async DeleteApplications(req, res) {
    const { id } = req.params;
    try {
      if (!id) {
        return res
          .status(404)
          .json({ Status: "Error", Message: "Application ID is empty" });
      }

      const Application = await ApplicationModel.deleteApplications(id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Deleting Application:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
}

module.exports = ApplicationController;
