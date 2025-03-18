const db = require("../config/db");

class TaskModel {
  /*------------------------GET ALL TASKS----------------------------------------*/
  static async getAllTasks() {
    try {
      const query = "SELECT * FROM tasks";
      const result = await db.executeQuery(query);
      return result.recordset; // Return all tasks
    } catch (err) {
      console.error("Error fetching all tasks:", err);
      throw err;
    }
  }

  /*------------------------GET ALL TASKS for a spacifice Application----------------------------------------*/
  static async getAllApplicationTasks(application_id) {
    try {
      const query = "SELECT * FROM tasks WHERE application_id = @appliction_id";
      const params = {
        application_id: application_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset; // Return all tasks
    } catch (err) {
      console.error("Error fetching all tasks:", err);
      throw err;
    }
  }

  /*------------------------GET A SPECIFIC TASK BY TASK ID-------------------------*/
  static async getOneTask(taskId) {
    try {
      const query = "SELECT * FROM tasks WHERE task_id = @task_id";
      const params = { task_id: taskId };
      const result = await db.executeQuery(query, params);
      return result.recordset; // Return the specific task
    } catch (err) {
      console.error("Error fetching task:", err);
      throw err;
    }
  }

  /*------------------------------Get Task's informations--------------------------------------*/
  static async getAllTaskInformationById(task_id) {
    try {
      const query = `SELECT 
T.task_description AS 'The Task Description',
T.task_description_file AS 'The Task Description File',
T.task_start_date AS 'Task Start Date',
T.task_duration AS 'Task Duration',
T.task_end_date AS 'Task End Date',
URT.user_fname +' '+ URT.user_lname AS 'The User Who Requested The Task',
UWT.user_fname +' '+ UWT.user_lname AS 'The User Who Work On This Task',
URA.user_fname +' '+ URA.user_lname AS 'The User Who Requested The Application'
FROM tasks AS T 
INNER JOIN applications AS A 
ON T.application_id = A.application_id
INNER JOIN users AS URT
ON URT.user_id = T.task_request_user_id
INNER JOIN users AS UWT
ON UWT.user_id = T.user_id
INNER JOIN users AS URA ON URA.user_id = A.application_request_user_id
WHERE T.task_id = @task_id`;
      const params = {
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error fetching Applications:", err);
      throw err;
    }
  }
  /*------------------------ADDING NEW TASK---------------------------------------*/
  static async addTask(task_description, task_request_user_id, application_id) {
    try {
      console.log("task_description in the model >>> ", task_description);
      const query = `INSERT INTO tasks (task_description, task_request_user_id, application_id, task_status_id) 
                    VALUES 
                    (@task_description, @task_request_user_id,@application_id, @task_status_id)`;
      const params = {
        task_description: task_description,
        task_request_user_id: task_request_user_id,
        application_id: application_id,
        task_status_id: 1,
      };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected; // Return the number of rows affected
    } catch (err) {
      console.error("Error adding new task:", err);
      throw err;
    }
  }
  /*------------------------Get Last Task ID---------------------------------------*/
  static async getLastTaskId() {
    try {
      const query = `SELECT TOP 1 task_id FROM tasks ORDER BY task_id DESC`;

      const result = await db.executeQuery(query);
      return result.rowsAffected; // Return the number of rows affected
    } catch (err) {
      console.error("Error Gettin Last Task ID:", err);
      throw err;
    }
  }
  /*------------------------ADDING NEW TASK File---------------------------------------*/
  static async addTaskFile(pdfFilePath, task_id, task_request_user_id) {
    try {
      const query = `INSERT INTO task_files (task_description_file, task_id, user_upload_file_id)
		                  VALUES
                    (@pdfFilePath, @task_id, @user_upload_file_id)`;
      const params = {
        pdfFilePath: pdfFilePath,
        task_id: task_id,
        user_upload_file_id: task_request_user_id,
      };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected; // Return the number of rows affected
    } catch (err) {
      console.error("Error adding new task:", err);
      throw err;
    }
  }

  /*------------------------UPDATE TASK DESCRIPTION---------------------------------------*/
  static async updateTaskDescription(taskData) {
    try {
      const { newTask_description, task_id } = taskData;
      const query =
        "UPDATE tasks SET task_description_file = @newTask_description WHERE task_id = @task_id";
      const params = { newTask_description, task_id };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected; // Return the number of rows affected
    } catch (err) {
      console.error("Error updating task description:", err);
      throw err;
    }
  }

  /*------------------------Assigen USER To TASK---------------------------------------*/
  static async AssginTask(user_Id, task_Id) {
    try {
      const query =
        "UPDATE tasks SET user_id = @user_Id , task_status_id = @task_status_id WHERE task_id = @task_id";
      const params = {
        user_Id: user_Id,
        task_status_id: 5,
        task_Id: task_Id,
      };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected;
    } catch (err) {
      console.error("Error extending task end date:", err);
      throw err;
    }
  }

  /*----------------------------Cancle The Task-----------------*/
  static async CancleTask(task_id) {
    try {
      const query = `
  UPDATE tasks
  SET 
    task_status_id = @task_status_id
  WHERE task_id = @task_id;
        `;
      const params = {
        task_status_id: 2,
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Approving Task:", err);
      throw err;
    }
  }
  /*----------------------------Approve The Task-----------------*/
  static async ApproveTask(task_id) {
    try {
      const query = `
  UPDATE tasks
  SET 
    task_status_id = @task_status_id
  WHERE task_id = @task_id;
        `;
      const params = {
        task_status_id: 3,
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Approving Task:", err);
      throw err;
    }
  }

  /*----------------------------Decline The Task-----------------*/
  static async DeclineTask(task_id) {
    try {
      const query = `
  UPDATE tasks
  SET 
    task_status_id = @task_status_id
  WHERE task_id = @task_id;
        `;
      const params = {
        task_status_id: 4,
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Approving Task:", err);
      throw err;
    }
  }

  /*----------------------------Comblete The Task-----------------*/
  static async CombleteTask(task_id) {
    try {
      const query = `
  UPDATE tasks
  SET 
    task_status_id = @task_status_id
  WHERE task_id = @task_id;
        `;
      const params = {
        task_status_id: 6,
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Approving Task:", err);
      throw err;
    }
  }

  /*----------------------------Assgin Duration to The Task-----------------*/

  static async AssignDuration(duration, duration_unit, currentDate, task_id) {
    try {
      const query = `
  DECLARE @date DATE = CONVERT(date, GETDATE(), 104)
  UPDATE tasks
  SET 
    task_duration = CAST(@duration AS NVARCHAR(10)) + ' ' + @duration_unit,
    task_start_date = @date,
    task_end_date = DATEADD(DAY, @currentDate, @date)
  WHERE task_id = @task_id;
        `;
      const params = {
        duration: duration,
        duration_unit: duration_unit,
        currentDate: currentDate,
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Assgining Duration:", err);
      throw err;
    }
  }

  /*------------------------Chanage USER TASK END DATE---------------------------------------*/
  static async changeTaskDuration(
    duration,
    duration_unit,
    currentDate,
    task_id
  ) {
    try {
      const query = `
  UPDATE tasks
  SET 
    task_duration = CAST(@duration AS NVARCHAR(10)) + ' ' + @duration_unit,
    task_end_date = DATEADD(DAY, @currentDate, (SELECT TOP 1 task_start_date FROM tasks WHERE task_id = @task_id))
  WHERE task_id = @task_id;
        `;
      const params = {
        duration: duration,
        duration_unit: duration_unit,
        currentDate: currentDate,
        task_id: task_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (error) {
      console.error("Error Assgining Duration:", err);
      throw err;
    }
  }

  /*------------------------DELETE SPECIFIC TASK---------------------------------------*/
  static async deleteTask(taskId) {
    try {
      const query = "DELETE FROM tasks WHERE task_id = @task_id";
      const params = { task_id: taskId };
      const result = await db.executeQuery(query, params);
      return result.rowsAffected; // Return the number of rows affected
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  }
}

module.exports = TaskModel;
