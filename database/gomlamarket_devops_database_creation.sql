-- Create the database
CREATE DATABASE gomlamarket_devops_database
COLLATE Arabic_CI_AS; -- Set the collation to support Arabic
GO

USE gomlamarket_devops_database;
GO

-- Create the branches table
CREATE TABLE branches (
    branch_id INT PRIMARY KEY IDENTITY(1,1),
    branch_name NVARCHAR(255) NOT NULL UNIQUE
);

-- Create the departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY IDENTITY(1,1),
    department_name NVARCHAR(255) NOT NULL UNIQUE
);

-- Create the users_groups table
CREATE TABLE users_groups (
    group_id INT PRIMARY KEY IDENTITY(1,1),
    group_role NVARCHAR(255) NOT NULL,
    group_privilege VARCHAR(255) NOT NULL
);

-- Create the users table
CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    user_fname NVARCHAR(255) NOT NULL CHECK (user_fname NOT LIKE '%[^a-zA-Z\u0600-\u06FF ]%'),
    user_lname NVARCHAR(255) NOT NULL CHECK (user_lname NOT LIKE '%[^a-zA-Z\u0600-\u06FF ]%'),
    user_phone VARCHAR(15) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE CHECK (user_email LIKE '%@gomlamarket.com'),
    user_password NVARCHAR(255) NOT NULL,
    user_branch_id INT NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_department_id INT NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_group_id INT NOT NULL REFERENCES users_groups(group_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create application/task state table
CREATE TABLE apps_tasks_meetings_status(
    apps_tasks_meetings_status_id INT PRIMARY KEY IDENTITY(1,1),
    apps_tasks_meetings_status_name NVARCHAR(255) NOT NULL UNIQUE
    CHECK (apps_tasks_meetings_status_name IN ('requested','canceled','approved','rejected','inprogress','completed')),
    apps_tasks_meetings_status_description NVARCHAR(255) NOT NULL
);


-- Create the applications table
CREATE TABLE applications (
    application_id INT PRIMARY KEY IDENTITY(1,1),
    application_description NVARCHAR(255),
    application_request_user_id INT NOT NULL,
	department_id INT NOT NULL,
	application_approved_user_id INT,
    application_status_id INT REFERENCES apps_tasks_meetings_status(apps_tasks_meetings_status_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (application_status_id BETWEEN 1 AND 6)
);

-- Create the applications files table
CREATE TABLE applications_files (
    applications_files_id INT PRIMARY KEY IDENTITY(1,1),
    application_description_file NVARCHAR(255),
    application_id INT REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE,
	user_upload_file_id INT REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the users_applications table
CREATE TABLE users_applications (
    user_id INT REFERENCES users(user_id) ,
    application_id INT REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE,
    application_start_date DATE,
    application_duration NVARCHAR(255),
    application_end_date DATE,
    PRIMARY KEY (user_id, application_id)
);

-- Create the tasks table
CREATE TABLE tasks (
    task_id INT PRIMARY KEY IDENTITY(1,1),
    task_description NVARCHAR(255) NOT NULL,
    user_id INT,
    task_request_user_id INT NOT NULL,
	task_approv_user_id INT,
    application_id INT NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE,
    task_start_date DATE, 
    task_duration NVARCHAR(255),
    task_end_date DATE,
    task_status_id INT NOT NULL REFERENCES apps_tasks_meetings_status(apps_tasks_meetings_status_id)
	CHECK (task_status_id BETWEEN 1 AND 6)
);

-- Create the task files table
CREATE TABLE task_files (
    tasks_files_id INT PRIMARY KEY IDENTITY(1,1),
    task_description_file NVARCHAR(255),
    task_id INT REFERENCES tasks(task_id) ON DELETE CASCADE ON UPDATE CASCADE,
	user_upload_file_id INT REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the meetings table
CREATE TABLE meetings (
    meeting_id INT PRIMARY KEY IDENTITY(1,1),
    meeting_type BIT NOT NULL,
    meeting_start_date DATE NOT NULL,
    meeting_status_id INT NOT NULL REFERENCES apps_tasks_meetings_status(apps_tasks_meetings_status_id) 
	CHECK (meeting_status_id BETWEEN 1 AND 6),
    meeting_important_points NVARCHAR(255),
    meeting_request_user_id INT NOT NULL,
    meeting_approved_user_id INT,
	meeting_description NVARCHAR(255) NOT NULL,
	application_id INT REFERENCES applications(application_id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Create the users_meeting_attend table
CREATE TABLE users_meeting_attend (
    meeting_id INT NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id),
	is_approve NVARCHAR(1),
    PRIMARY KEY (meeting_id, user_id)
);

-- Create the users_online_meeting table
CREATE TABLE users_online_meeting (
    meeting_id INT NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE ON UPDATE CASCADE,
    meeting_link NVARCHAR(255) NOT NULL,
    PRIMARY KEY (meeting_id , meeting_link)
);
GO

------------------------------------------------TRIGGERS---------------------------------------------------------------------------------------

--------------------------------------------------DELETING Triggers----------------------------------------------------------------------------

--Trigger instaed of ON DELETE for user_id column in users_applications Table
GO;
CREATE TRIGGER trg_users_applications_delete
ON users
AFTER DELETE
AS
BEGIN
    DELETE FROM users_applications WHERE user_id IN (SELECT user_id FROM DELETED);
END;

--Trigger instaed of ON DELETE for applications_id column in users_applications Table
GO;
CREATE TRIGGER trg_users_applications_delete_app
ON applications
AFTER DELETE
AS
BEGIN
    DELETE FROM users_applications WHERE application_id IN (SELECT application_id FROM DELETED);
END;

--If an application is deleted, related tasks should also be deleted
GO;
CREATE TRIGGER trg_tasks_delete_applications
ON applications
AFTER DELETE
AS
BEGIN
    DELETE FROM tasks WHERE user_id IN (SELECT application_id FROM DELETED);
END;

--If a user is deleted, their associated tasks should also be deleted
GO;
CREATE TRIGGER trg_tasks_delete_users_request
ON users
AFTER DELETE
AS
BEGIN
    DELETE FROM tasks WHERE task_request_user_id IN (SELECT user_id FROM DELETED);
END;

--If a user linked to the application is deleted, their related tasks should also be deleted
GO;
CREATE TRIGGER trg_tasks_delete_users_application
ON users
AFTER DELETE
AS
BEGIN
    DELETE FROM tasks WHERE application_id IN (SELECT user_id FROM DELETED);
END;

--IF a meeting is deleted, remove associated rows from the users_meeting_attend table
GO;
CREATE TRIGGER trg_users_meeting_attend_delete_meeting
ON meetings
AFTER DELETE
AS
BEGIN
    DELETE FROM users_meeting_attend WHERE meeting_id IN (SELECT meeting_id FROM DELETED);
END;

--If a requesting user is deleted, remove their associated meetings and attendances
CREATE TRIGGER trg_meetings_delete_request_user
ON users
AFTER DELETE
AS
BEGIN
    DELETE FROM meetings WHERE meeting_request_user_id IN (SELECT user_id FROM DELETED);
    DELETE FROM users_meeting_attend WHERE user_id IN (SELECT user_id FROM DELETED);
END;

--If an approved user is deleted, remove their associated meetings and attendances
GO;
CREATE TRIGGER trg_meetings_delete_approved_user
ON users
AFTER DELETE
AS
BEGIN
    DELETE FROM meetings WHERE meeting_approved_user_id IN (SELECT user_id FROM DELETED);
    DELETE FROM users_meeting_attend WHERE user_id IN (SELECT user_id FROM DELETED);
END;

------------------------------------------------------UPDATEING Triggers-----------------------------------------------------------------------

--Trigger instaed of ON UPDATE for user_id column in users_applications Table
GO;
CREATE TRIGGER trg_users_applications_update
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE users_applications
    SET user_id = (SELECT user_id FROM INSERTED)
    WHERE user_id IN (SELECT user_id FROM DELETED);
END;

--Trigger instaed of ON UPDATE for applications_id column in users_applications Table
GO;
CREATE TRIGGER trg_users_applications_update_app
ON applications
AFTER UPDATE
AS
BEGIN
    UPDATE users_applications
    SET application_id = (SELECT application_id FROM INSERTED)
    WHERE application_id IN (SELECT application_id FROM DELETED);
END;


--If an application's ID is updated, propagate the change to related tasks
GO;
CREATE TRIGGER trg_tasks_update_applications
ON applications
AFTER UPDATE
AS
BEGIN
    UPDATE tasks
    SET user_id = (SELECT application_id FROM INSERTED)
    WHERE user_id IN (SELECT application_id FROM DELETED);
END;

--If a user's ID is updated, propagate the change to tasks where they are the requesting user
GO;
CREATE TRIGGER trg_tasks_update_users_request
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE tasks
    SET task_request_user_id = (SELECT user_id FROM INSERTED)
    WHERE task_request_user_id IN (SELECT user_id FROM DELETED);
END;

--If a user's ID is updated, propagate the change to tasks linked to their application
Go;
CREATE TRIGGER trg_tasks_update_users_application
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE tasks
    SET application_id = (SELECT user_id FROM INSERTED)
    WHERE application_id IN (SELECT user_id FROM DELETED);
END;

--If a meeting ID is updated, propagate the change to the users_meeting_attend table
GO;
CREATE TRIGGER trg_users_meeting_attend_update_meeting
ON meetings
AFTER UPDATE
AS
BEGIN
    UPDATE users_meeting_attend
    SET meeting_id = (SELECT meeting_id FROM INSERTED)
    WHERE meeting_id IN (SELECT meeting_id FROM DELETED);
END;

--If a requesting user's ID is updated, propagate the change to the meetings table
GO;
CREATE TRIGGER trg_meetings_update_request_user
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE meetings
    SET meeting_request_user_id = (SELECT user_id FROM INSERTED)
    WHERE meeting_request_user_id IN (SELECT user_id FROM DELETED);
END;
--If an approved user's ID is updated, propagate the change to the meetings table
GO;
CREATE TRIGGER trg_meetings_update_approved_user
ON users
AFTER UPDATE
AS
BEGIN
    UPDATE meetings
    SET meeting_approved_user_id = (SELECT user_id FROM INSERTED)
    WHERE meeting_approved_user_id IN (SELECT user_id FROM DELETED);
END;

---------------------------------------------------Show All Database Trigge--------------------------------------------------------------------

--SELECT All Triggers In The Database
SELECT * FROM sys.triggers

-----------------------------------------------------------------------------------------------------------------------------------------------

--------------------------------------------------Drop Constraint---------------------------------------------------------------------------------
SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'tasks' 

ALTER TABLE tasks DROP CONSTRAINT FK__tasks__applicati__440B1D61;

ALTER TABLE tasks
ADD CONSTRAINT FK__tasks__applicati__440B1D61
FOREIGN KEY (application_id)
REFERENCES applications (application_id)
ON DELETE CASCADE ON UPDATE CASCADE ;


---------------------------------------------------DROP The Database---------------------------------------------------------------------------

SELECT 
    spid, 
    db_name(dbid) AS DatabaseName, 
    loginame AS LoginName, 
    hostname AS HostName, 
    program_name AS ProgramName
FROM sys.sysprocesses
WHERE dbid = DB_ID('gomlamarket_devops_database');


ALTER DATABASE gomlamarket_devops_database
SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO


USE master;
GO

DROP DATABASE gomlamarket_devops_database;
GO

