const db = require("../config/db");

class ApplicationModel {
  /*------------------------------Get All Applications--------------------------------------*/
  static async getAllApplications() {
    try {
      const query = "SELECT * FROM applications";
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get All User Applications---------------------------------*/
  static async getAllUserApplications(user_Id) {
    try {
      const query = `SELECT 
    DISTINCT A.application_id, 
    A.application_description, 
    A.application_request_user_id,
    A.application_approved_user_id,
    A.application_status_id,
	ATMS.apps_tasks_meetings_status_name,
    FORMAT(UA.application_start_date, 'yyyy-MM-dd') AS 'application_start_date',
    UA.application_duration,
	FORMAT(UA.application_end_date, 'yyyy-MM-dd') AS 'application_end_date'
FROM applications AS A 
LEFT JOIN users_applications AS UA ON A.application_id = UA.application_id 
INNER JOIN apps_tasks_meetings_status AS ATMS ON ATMS.apps_tasks_meetings_status_id = A.application_status_id
WHERE 
    -- User requested or approved the application
    (A.application_request_user_id = @user_id OR A.application_approved_user_id = @user_id OR UA.user_id = @user_id) 
    OR 
    -- User is in the same department as the requester or approver with group_id 1 or 2
    (
        (SELECT user_department_id FROM users WHERE user_id = @user_id) IN (
            SELECT user_department_id FROM users WHERE user_id = A.application_request_user_id
        ) 
        AND 
        (SELECT user_group_id FROM users WHERE user_id = @user_id) IN (1, 2)
    )
    OR 
    (
        (SELECT user_department_id FROM users WHERE user_id = @user_id) IN (
            SELECT user_department_id FROM users WHERE user_id = A.application_approved_user_id
        ) 
        AND 
        (SELECT user_group_id FROM users WHERE user_id = @user_id) IN (1, 2)
    ) 
	OR
	(
        (SELECT user_department_id FROM users WHERE user_id = @user_id) IN (
            SELECT user_department_id FROM users WHERE user_department_id = A.department_id
        ) 
        AND 
        (SELECT user_group_id FROM users WHERE user_id = @user_id) IN (1, 2)
    );
 `;

      const params = {
        user_id: user_Id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching User Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get All User Applications---------------------------------*/
  static async getAllApplicationsinformations(application_id) {
    try {
      const query = `SELECT
A.application_description AS 'Application_Description', 
A.department_id AS 'Application_department_id',
AF.application_description_file AS 'Application_Desription_File_Path', 
URA.user_fname + ' ' + URA.user_lname AS 'The_User_Who_request_The_Application',
URA.user_id AS 'The_User_Who_request_The_Application_id',
URA.user_department_id AS 'The_User_Who_request_The_Application_Department_id',
UAA.user_fname + ' ' + UAA.user_lname AS 'The_User_Who_Approved_The_Application',
UAA.user_id AS 'The_User_Who_Approved_The_Application_id',
U.user_id AS 'The_User_Who_work_on_The_Application_id',
U.user_fname + ' ' + U.user_lname AS 'The_User_Who_Work_on_The_Application',
FORMAT(UA.application_start_date, 'yyyy-MM-dd') AS 'Application_Start_Date',
UA.application_duration AS 'Application_Duration',
FORMAT(UA.application_end_date, 'yyyy-MM-dd') AS 'Application_End_Date',
ATS.apps_tasks_meetings_status_name AS 'Application_State',
A.application_status_id AS 'Application_State_id'
FROM applications AS A 
LEFT JOIN applications_files AS AF 
ON AF.application_id = A.application_id
LEFT JOIN users_applications AS UA 
ON A.application_id = UA.application_id 
INNER JOIN apps_tasks_meetings_status AS ATS
ON A.application_status_id = ATS.apps_tasks_meetings_status_id
LEFT JOIN users AS U
On U.user_id = UA.user_id
LEFT JOIN users AS URA
ON URA.user_id = A.application_request_user_id
LEFT JOIN users AS UAA
ON UAA.user_id = A.application_approved_user_id
WHERE A.application_id = @application_id`;

      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications Informations:", err);
      throw err;
    }
  }

  /*------------------------------Get Application By id--------------------------------------*/
  static async getAllApplicationsByid(application_id) {
    try {
      const query =
        "SELECT * FROM applications WHERE application_id = @application_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get Application's Tasks--------------------------------------*/
  static async getAllApplicationTasks(application_id) {
    try {
      const query =
        "SELECT * FROM applications WHERE application_id = @application_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get Application's Tasks Number--------------------------------------*/
  static async getApplicationTasksNumber(application_id) {
    try {
      const query =
        "SELECT COUNT(task_id) AS 'The_number_of_Tasks' FROM tasks WHERE application_id = @application_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get Application's Completed Tasks Number--------------------------------------*/
  static async getApplicationCompletedTasksNumber(application_id) {
    try {
      const query =
        "SELECT COUNT(task_id) AS 'The_number_of_Completed_Tasks' FROM tasks WHERE task_status_id = 6 AND application_id = @application_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get Application's Uncompleted Tasks Number--------------------------------------*/
  static async getApplicationUncompletedTasksNumber(application_id) {
    try {
      const query =
        "SELECT COUNT(task_id) AS 'The_number_of_Uncompleted_Tasks' FROM tasks WHERE task_status_id != 6 AND application_id = @application_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get Application's meetings--------------------------------------*/
  static async getApplicationMeeting(application_id, user_id) {
    try {
      const query = `SELECT
M.meeting_id,
M.application_id,
M.meeting_type,
UOM.meeting_link,
UMA.user_id,
FORMAT(M.meeting_start_date , 'yyyy-MM-dd') AS 'Meeting_Start_Date',
ATMS.apps_tasks_meetings_status_name AS 'Meeting_Status',
M.meeting_important_points,
UR.user_fname + ' ' + UR.user_lname AS 'User_Who_Request_Meeting',
UMA.is_approve
FROM meetings AS M 
LEFT JOIN users_online_meeting AS UOM
ON UOM.meeting_id = M.meeting_id
INNER JOIN apps_tasks_meetings_status AS ATMS
ON ATMS.apps_tasks_meetings_status_id = M.meeting_status_id
INNER JOIN users AS UR 
ON UR.user_id = M.meeting_request_user_id
LEFT JOIN users_meeting_attend AS UMA
ON M.meeting_id = UMA.meeting_id
WHERE M.application_id = @application_id AND 
(UMA.user_id = @user_id OR is_approve IS NULL 
OR (is_approve IS NOT NULL AND UMA.user_id <> @user_id AND M.meeting_id NOT IN (SELECT meeting_id FROM users_meeting_attend WHERE user_id = @user_id)))
  `;
      const params = {
        application_id: application_id,
        user_id: user_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*------------------------------Get Application's Tasks--------------------------------------*/
  static async getApplicationTasks(application_id) {
    try {
      const query = `SELECT 
T.task_id,
T.task_description AS 'The_Task_Description',
TF.task_description_file AS 'The_Task_Description_File_Path',
FORMAT(T.task_start_date, 'yyyy-MM-dd') AS 'Task_Start_Date',
T.task_duration AS 'Task_Duration',
FORMAT(T.task_end_date, 'yyyy-MM-dd') AS 'Task_End_Date',
URT.user_fname +' '+ URT.user_lname AS 'The_User_Who_Requested_The_Task',
UWT.user_fname +' '+ UWT.user_lname AS 'The_User_Who_Work_On_This_Task',
URA.user_fname +' '+ URA.user_lname AS 'The_User_Who_Requested_The_Application',
UAA.user_fname +' '+ UAA.user_lname AS 'The_User_Who_Approved_The_Application',
ATS.apps_tasks_meetings_status_name AS 'Task_Status',
T.task_status_id AS 'Task_Status_id'
FROM tasks AS T 
INNER JOIN applications AS A 
ON T.application_id = A.application_id
LEFT JOIN task_files AS TF
ON TF.task_id = T.task_id
INNER JOIN users AS URT
ON URT.user_id = T.task_request_user_id
LEFT JOIN users AS UWT
ON UWT.user_id = T.user_id
INNER JOIN users AS URA 
ON URA.user_id = A.application_request_user_id
INNER JOIN users AS UAA 
ON UAA.user_id = A.application_approved_user_id
INNER JOIN apps_tasks_meetings_status AS ATS ON ATS.apps_tasks_meetings_status_id = T.task_status_id
WHERE T.application_id = @application_id
  `;
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }

  /*----------------------------Add Application---------------------------------*/
  static async addApplication({
    department_id,
    application_request_user_id,
    application_description,
  }) {
    try {
      // SQL Query
      const query = `INSERT INTO applications 
        (application_description, application_request_user_id, department_id,application_approved_user_id, application_status_id)
		    VALUES
        (@application_description, @application_request_user_id, @department_id,@application_approved_user_id, @application_status_id)`;
      const params = {
        application_description: application_description,
        application_request_user_id: application_request_user_id,
        department_id: department_id,
        application_approved_user_id: null,
        application_status_id: 1,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Application:", err);
      throw err;
    }
  }
  /*----------------------------Get last Application ID---------------------------------*/
  static async getLastApplicationId() {
    try {
      // SQL Query
      const query = `SELECT TOP 1 application_id FROM applications ORDER BY application_id DESC`;
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Application File:", err);
      throw err;
    }
  }
  /*----------------------------Add Application File---------------------------------*/
  static async addApplicationFile({
    pdfFilePath,
    application_request_user_id,
    application_id,
  }) {
    try {
      // SQL Query
      const query = `INSERT INTO applications_files
        (application_description_file, application_id, user_upload_file_id)
		    VALUES
        (@pdfFilePath, @application_id, @application_request_user_id)`;
      const params = {
        pdfFilePath: pdfFilePath,
        application_request_user_id: application_request_user_id,
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Application File:", err);
      throw err;
    }
  }
  /*----------------------------Cancle Application---------------------------------*/
  static async cancleApplication(application_id) {
    try {
      // SQL Query
      const query = `UPDATE applications
SET application_status_id = @application_status_id
WHERE application_id = @application_id`;
      const params = {
        application_id: application_id,
        application_status_id: 2,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Cancle Application:", err);
      throw err;
    }
  }
  /*----------------------------Approve Application---------------------------------*/
  static async approveApplication(
    application_approved_user_id,
    application_id
  ) {
    try {
      // SQL Query
      const query = `UPDATE applications
SET application_status_id = @application_status_id ,
application_approved_user_id = @application_approved_user_id
WHERE application_id = @application_id`;
      const params = {
        application_approved_user_id: application_approved_user_id,
        application_id: application_id,
        application_status_id: 3,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Approve Application:", err);
      throw err;
    }
  }
  /*----------------------------Decline Application---------------------------------*/
  static async declineApplication(
    application_approved_user_id,
    application_id
  ) {
    try {
      // SQL Query
      const query = `UPDATE applications
SET application_status_id = @application_status_id ,
application_approved_user_id = @application_approved_user_id
WHERE application_id = @application_id`;
      const params = {
        application_approved_user_id: application_approved_user_id,
        application_id: application_id,
        application_status_id: 4,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Decline Application:", err);
      throw err;
    }
  }
  /*----------------------------Chanage Application State---------------------------------*/
  static async chanageApplicationState(application_status_id, application_id) {
    try {
      // SQL Query
      const query = `UPDATE applications
SET application_status_id = @application_status_id
WHERE application_id = @application_id`;
      const params = {
        application_id: application_id,
        application_status_id: application_status_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Chanage Application State Application:", err);
      throw err;
    }
  }

  /*---------------------------Get Application Start date, Duration, End date to assigin employee to task in task model---------------------*/
  static async getApplicationStardDate(application_id) {
    try {
      const query = `SELECT TOP 1 
FORMAT(application_start_date, 'yyyy-MM-dd') AS 'application_start_date',
application_duration,
FORMAT(application_end_date, 'yyyy-MM-dd') AS 'application_end_date' 
FROM users_applications 
WHERE application_id = @application_id AND application_start_date IS NOT NULL `;
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      console.log(result.recordset);
      return result.recordset;
    } catch (err) {
      console.error(
        "Error Getting Application Start date, Duration, And End date:",
        err
      );
      throw err;
    }
  }

  /*---------------------------Get Users Work On Application---------------------*/
  static async getApplicationWorkOn(application_id) {
    try {
      const query = `SELECT 
UA.user_id AS 'Employee_Id',
U.user_fname + ' ' + U.user_lname AS 'Employee_Name'
FROM users_applications AS UA
INNER JOIN users AS U
ON U.user_id = UA.user_id
WHERE UA.application_id = @application_id`;
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Getting Users Who Work On Application:", err);
      throw err;
    }
  }

  /*----------------------------Assgin Employee to Application---------------------*/
  static async AssginApplication(
    user_id,
    application_id,
    application_start_date,
    application_duration,
    application_end_date
  ) {
    try {
      if (
        application_start_date &&
        application_duration &&
        application_end_date
      ) {
        const query = `INSERT INTO users_applications (user_id, application_id, application_start_date, application_duration, application_end_date) 
        VALUES (@user_id, @application_id, @application_start_date, @application_duration, @application_end_date)`;
        const params = {
          user_id: user_id,
          application_id: application_id,
          application_start_date: application_start_date,
          application_duration: application_duration,
          application_end_date: application_end_date,
        };
        const result = await db.executeQuery(query, params);
        return result.recordset;
      } else {
        const query = `INSERT INTO users_applications (user_id, application_id) VALUES (@user_id, @application_id)`;
        const params = {
          user_id: user_id,
          application_id: application_id,
        };
        const result = await db.executeQuery(query, params);
        return result.recordset;
      }
    } catch (err) {
      console.error("Error Assgining Application:", err);
      throw err;
    }
  }

  /*----------------------------Assgin Employee to Application---------------------*/
  static async AssginApplicationState(application_id) {
    try {
      const query = `UPDATE applications
SET application_status_id = @application_status_id
WHERE application_id = @application_id`;
      const params = {
        application_id: application_id,
        application_status_id: 5,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Application:", err);
      throw err;
    }
  }

  /*----------------------------Chanage Employee Who Work On The Application---------------------*/
  static async ChanageAssginApplication(olduser_Id, user_Id, application_Id) {
    try {
      // SQL Query
      const query = `UPDATE users_applications
  SET user_id = @user_id
  WHERE application_id = @application_id AND user_id = @olduser_Id`;
      const params = {
        olduser_Id: olduser_Id,
        user_id: user_Id,
        application_id: application_Id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Application:", err);
      throw err;
    }
  }

  /*----------------------------Assgin Duration to The Application-----------------*/
  static async AssignDuration(
    duration,
    duration_unit,
    currentDate,
    application_Id,
    user_Id
  ) {
    try {
      const query = `
DECLARE @date date = CONVERT(date, GETDATE(), 104)
UPDATE users_applications
SET 
  application_duration = CAST(@duration AS NVARCHAR(10)) + ' ' + @duration_unit,
  application_start_date = @date,
  application_end_date = DATEADD(DAY, @currentDate, @date)
WHERE user_id = @user_Id AND application_id = @application_Id;
      `;
      const params = {
        duration: duration,
        duration_unit: duration_unit,
        currentDate: currentDate,
        application_Id: application_Id,
        user_Id: user_Id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Assgining Duration:", err);
      throw err;
    }
  }

  /*------------------------Chanage USER Application END DATE---------------------------------------*/
  static async ChanageApplicationDuration(
    duration,
    duration_unit,
    currentDate,
    application_id
  ) {
    try {
      const query = `UPDATE users_applications
SET 
  application_duration = CAST(@duration AS NVARCHAR(10)) + ' ' + @duration_unit,
  application_end_date = DATEADD(DAY, @currentDate, (SELECT TOP 1 application_start_date FROM users_applications WHERE application_id = @application_id))
WHERE application_id = @application_id;`;
      const params = {
        duration: duration,
        duration_unit: duration_unit,
        currentDate: currentDate,
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Assgining Duration:", err);
      throw err;
    }
  }

  /*----------------------------Delete Appliction by its id------------------------*/
  static async deleteApplications(application_id) {
    try {
      const query =
        "DELETE FROM applications WHERE application_id = @application_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Deleting Application:", err);
      throw err;
    }
  }
}
module.exports = ApplicationModel;
