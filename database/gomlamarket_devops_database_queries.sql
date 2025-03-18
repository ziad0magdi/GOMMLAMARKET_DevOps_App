SELECT * FROM departments
SELECT * FROM users
SELECT * FROM applications
SELECT * FROM users_applications
SELECT * FROM users_groups
SELECT * FROM applications_files
--------------------------------Get All task Informations-------------------------------------------------------------- 
SELECT 
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
WHERE T.application_id = 8


SELECT * FROM tasks
SELECT * FROM apps_tasks_meetings_status
SELECT * FROM users
SELECT * FROM users_applications
SELECT * FROM applications

---------------------------Get All Application Information for a spacific User-------------------------
SELECT 
A.application_id, 
A.application_description, 
AF.application_description_file,
A.application_request_user_id,
A.application_approved_user_id,
FORMAT(UA.application_start_date, 'yyyy-MM-dd') AS 'application_Start_Date',
UA.application_duration 
FROM applications as A 
LEFT JOIN applications_files AS AF
ON AF.application_id = A.application_id
INNER JOIN users_applications as UA 
ON A.application_id = UA.application_id 
WHERE UA.user_id = 1

SELECT * FROM users
SELECT * FROM applications
SELECT (application_id) FROM users_applications
---------------------------Get All Application Information for a spacific User-------------------------
SELECT
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
WHERE A.application_id = 24

SELECT * FROM users
SELECT * FROM applications
SELECT * FROM applications_files
SELECT * FROM users_applications
SELECT * FROM apps_tasks_meetings_status
----------------------------Get All user's Applications-----------------------------------------
SELECT 
DISTINCT(A.application_id), 
A.application_description, 
A.application_request_user_id,
A.application_approved_user_id,
A.application_status_id,
FORMAT(UA.application_start_date, 'yyyy-MM-dd') AS 'application_start_date',
UA.application_duration 
FROM applications as A 
LEFT JOIN users_applications as UA 
on A.application_id = UA.application_id 
WHERE UA.user_id = 4 OR
A.application_request_user_id = 1 OR
A.application_approved_user_id = 1
OR (A.application_request_user_id IN 
(SELECT user_id FROM users WHERE user_department_id = (SELECT user_department_id FROM users WHERE user_id = 1) AND user_group_id IN (1 , 2)))
OR (A.application_approved_user_id IN (SELECT user_id FROM users WHERE user_department_id = (SELECT user_department_id FROM users WHERE user_id = 1) AND user_group_id IN (1 , 2)))

SELECT * FROM users
SELECT * FROM applications
SELECT * FROM users_applications
SELECT * FROM applications_files
SELECT * FROM apps_tasks_meetings_status
DELETE FROM applications

----------------------------Get All user's Applications GPT Version ----------------------------
SELECT 
    DISTINCT A.application_id, 
    A.application_description, 
    A.application_request_user_id,
    A.application_approved_user_id,
    A.application_status_id,
    FORMAT(UA.application_start_date, 'yyyy-MM-dd') AS 'application_start_date',
    UA.application_duration 
FROM applications AS A 
LEFT JOIN users_applications AS UA ON A.application_id = UA.application_id 
WHERE 
    -- User requested or approved the application
    (A.application_request_user_id = 2 OR A.application_approved_user_id = 2 OR UA.user_id = 2) 
    OR 
    -- User is in the same department as the requester or approver with group_id 1 or 2
    (
        (SELECT user_department_id FROM users WHERE user_id = 2) IN (
            SELECT user_department_id FROM users WHERE user_id = A.application_request_user_id
        ) 
        AND 
        (SELECT user_group_id FROM users WHERE user_id = 2) IN (1, 2)
    )
    OR 
    (
        (SELECT user_department_id FROM users WHERE user_id = 2) IN (
            SELECT user_department_id FROM users WHERE user_id = A.application_approved_user_id
        ) 
        AND 
        (SELECT user_group_id FROM users WHERE user_id = 2) IN (1, 2)
    ) 
	OR
	(
        (SELECT user_department_id FROM users WHERE user_id = 2) IN (
            SELECT user_department_id FROM users WHERE user_department_id = A.department_id
        ) 
        AND 
        (SELECT user_group_id FROM users WHERE user_id = 2) IN (1, 2)
    );

----------------------------Get All tasks for an Application------------------------------------
SELECT COUNT(task_id) AS 'The number of Tasks' 
FROM tasks 
WHERE application_id = 1

SELECT * FROM tasks
SELECT * FROM applications
----------------------------Get All Completed tasks for an Application----------------
SELECT COUNT(task_id) AS 'The number of Completed Tasks' 
FROM tasks
WHERE task_status_id = 6 AND application_id = 1

SELECT * FROM tasks
SELECT * FROM applications
----------------------------Get All Uncompleted tasks for an Application----------------
SELECT COUNT(task_id) AS 'The number of Uncompleted Tasks' 
FROM tasks
WHERE task_status_id != 6 AND application_id = 1
----------------------------Get All Application Meetings--------------------------------
SELECT
M.meeting_type,
UOM.meeting_link,
FORMAT(M.meeting_start_date , 'yyyy-MM-dd') AS 'Meeting_Start_Date',
ATMS.apps_tasks_meetings_status_name AS 'Meeting_Status',
M.meeting_important_points,
UR.user_fname + ' ' + UR.user_lname AS 'User_Who_Request_Meeting',
UA.user_fname + ' ' + UA.user_lname AS 'User_Who_Approved_Meeting'
FROM meetings AS M 
LEFT JOIN users_online_meeting AS UOM
ON UOM.meeting_id = M.meeting_id
INNER JOIN apps_tasks_meetings_status AS ATMS
ON ATMS.apps_tasks_meetings_status_id = M.meeting_status_id
INNER JOIN users AS UR 
ON UR.user_id = M.meeting_request_user_id
LEFT JOIN users AS UA 
ON UA.user_id = M.meeting_approved_user_id
WHERE M.application_id = 20

SELECT * FROM tasks 
SELECT * FROM applications
SELECT * FROM meetings
SELECT * FROM users_online_meeting

----------------------------Get All Employee In the same Department as the Manager---------------------
SELECT 
user_fname + ' ' + user_lname AS 'Employee_Full_Name',
user_id
FROM users 
WHERE user_department_id = (SELECT user_department_id FROM users WHERE user_id = 5) AND user_id <> 5

SELECT * FROM users;
----------------------------Aprove Application----------------------------------------------
UPDATE applications
SET application_status_id = 3 , application_approved_user_id =1
WHERE application_id = 1

SELECT * FROM applications
SELECT * FROM apps_tasks_meetings_status
----------------------------Assgin Duration to Application----------------------------------------------
DECLARE @date date = CONVERT(date, GETDATE(), 104)
DECLARE @duration int = 365
DECLARE @duration_unit VARCHAR(10) = 'day'
UPDATE users_applications
SET 
  application_duration = CAST(@duration AS NVARCHAR(10)) + ' ' + @duration_unit,
  application_start_date = @date,
  application_end_date = DATEADD(DAY, @duration, @date)
WHERE user_id = 1 AND application_id = 16;

SELECT * FROM  users_applications
-----------------------------------------Update Task Duration----------------------------------------------
GO;
  DECLARE @date DATE = CONVERT(date, GETDATE(), 104)
  UPDATE tasks
  SET 
    task_duration = CAST('1' AS NVARCHAR(10)) + ' ' +'day',
    task_start_date = @date,
    task_end_date = DATEADD(DAY, 1, @date)
  WHERE task_id = 1;

  SELECT * FROM tasks

-----------------------------------------Update Applicaiton Duration----------------------------------------------
UPDATE users_applications
SET 
  application_duration = CAST(2 AS NVARCHAR(10)) + ' ' + 'يوم',
  application_end_date = DATEADD(DAY, 2, (SELECT TOP 1 application_start_date FROM users_applications WHERE application_id = 11))
WHERE application_id = 11;

SELECT * FROM users_applications
SELECT TOP 1 application_start_date FROM users_applications WHERE application_id = 11

-------------------------------Update user who work on Application-----------------------------------------------------------------
UPDATE users_applications
  SET user_id = 1
  WHERE application_id = 2 AND user_id = 1

-------------------------------Get All meeting (Approve, Decline or wait) for user-------------------------------------------------
SELECT
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
WHERE M.application_id = 23 AND 
(UMA.user_id = 1 OR is_approve IS NULL 
OR (is_approve IS NOT NULL AND UMA.user_id <> 1 AND M.meeting_id NOT IN (SELECT meeting_id FROM users_meeting_attend WHERE user_id = 1)))


SELECT * FROM users
SELECT * FROM meetings 
SELECT * FROM users_meeting_attend
SELECT * FROM users_online_meeting

SELECT
M.application_id,
M.meeting_type,
UOM.meeting_link,
M.meeting_id,
UMA.user_id AS 'user_approve_reject_id',
UMA.is_approve,
FORMAT(M.meeting_start_date , 'yyyy-MM-dd') AS 'Meeting_Start_Date',
ATMS.apps_tasks_meetings_status_name AS 'Meeting_Status',
M.meeting_important_points,
UR.user_fname + ' ' + UR.user_lname AS 'User_Who_Request_Meeting'
FROM meetings AS M 
LEFT JOIN users_online_meeting AS UOM
ON UOM.meeting_id = M.meeting_id
INNER JOIN apps_tasks_meetings_status AS ATMS
ON ATMS.apps_tasks_meetings_status_id = M.meeting_status_id
INNER JOIN users AS UR 
ON UR.user_id = M.meeting_request_user_id
LEFT JOIN users_meeting_attend AS UMA
ON M.meeting_id = UMA.meeting_id
WHERE M.application_id = 23 

SELECT * FROM meetings WHERE application_id = 23