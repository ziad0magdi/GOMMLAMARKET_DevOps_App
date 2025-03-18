-- Insert into branches
INSERT INTO branches (branch_name) 
VALUES 
('Rose Garden Branch'), 
('Downtown Branch'), 
('Suburb Branch');

SELECT * FROM branches

-- Insert into departments
INSERT INTO departments (department_name) 
VALUES 
('Accounting Department'), 
('IT Department'), 
('HR Department');

SELECT * FROM departments

-- Insert into users_groups
INSERT INTO users_groups (group_role, group_privilege) 
VALUES 
('Admin', 'Full Access'), 
('Manager', 'Moderate Access'), 
('Employee', 'Limited Access');

SELECT * FROM users_groups

-- Insert into users
INSERT INTO users (user_fname, user_lname, user_phone, user_email, user_password, user_branch_id, user_department_id, user_group_id) 
VALUES 
('Ahmed', 'Ali', '01012345678', 'ahmed@gomlamarket.com', 'password123', 1, 1, 1),
('Sara', 'Mohamed', '01123456789', 'sara@gomlamarket.com', 'password123', 2, 2, 2),
('Youssef', 'Hassan', '01234567890', 'youssef@gomlamarket.com', 'password123', 3, 3, 3);

SELECT * FROM users

-- Inser into apps_tasks_meetings_status
INSERT INTO apps_tasks_meetings_status (apps_tasks_meetings_status_name, apps_tasks_meetings_status_description) VALUES
	('requested', 'Task, application or meeting was requested but not approved yet.'),
    ('canceled', 'Task, application or meeting was canceled by the one who requested it.'),
    ('approved', 'Task, application or meeting was approved by the manager of the department which the application was sent to.'),
    ('rejected', 'Task, application or meeting was rejected by the manager of the department which the application was sent to.'),
    ('inprogress', 'Task, application or meeting was approved by the manager of the department which the application was sent to and was assigned to someone to work on it.'),
    ('completed', 'Task, application or meeting was finished.');

SELECT * FROM apps_tasks_meetings_status

-- Insert into applications
INSERT INTO applications (application_description, application_request_user_id,application_approved_user_id, application_status_id) 
VALUES 
('Purchase request', 'purchase_request_01.pdf', 1, 2, 1),
('System upgrade request', 'system_upgrade_02.pdf', 2, 3,2),
('Leave application', 'leave_application_03.pdf', 3, 1,3),
('System upgrade request', 'leave_application_04.pdf', 1, 3,4),
('Leave application', 'leave_application_05.pdf', 2, 1,5),
('Purchase request', 'leave_application_06.pdf', 3, 2,6);

SELECT * FROM applications
SELECT * FROM applications_files

-- Insert into users_applications
INSERT INTO users_applications (user_id, application_id) 
VALUES 
(6, 3),
(1, 2),
(1, 5),
(2, 3),
(2, 6),
(3, 4),
(3, 7);

SELECT * FROM users_applications

-- Insert into tasks
INSERT INTO tasks (task_description, task_description_file, user_id, task_request_user_id, application_id, task_start_date, task_duration, task_end_date, task_status_id) 
VALUES 
('Prepare managerial report', 'managerial_report_01.pdf', 3, 2, 2, '2025-01-01', '2 days', '2025-01-03', 6),
('Prepare financial report', 'financial_report_01.pdf', 2, 1, 3, '2025-01-01', '2 days', '2025-01-03', 2),
('Upgrade server hardware', 'server_upgrade_02.pdf', 2, 3, 4, '2025-01-04', '1 day', '2025-01-05', 3),
('Process leave request', 'leave_request_03.pdf', 3, 1, 3, '2025-01-06', '1 day', '2025-01-07', 1);

SELECT * FROM tasks

-- Insert into meetings
INSERT INTO meetings (meeting_type, meeting_start_date, meeting_status_id, meeting_important_points, meeting_request_user_id, meeting_approved_user_id, task_id) 
VALUES 
(1, '2025-01-10', 1, 'Discuss Q1 targets', 1, 2, 1),
(0, '2025-01-15', 2, 'Discuss Q2 targets', 2, 3, 2),
(1, '2025-01-20', 3, 'Discuss Q3 targets', 3, 1, 1),
(1, '2025-01-20', 4, 'Discuss Q4 targets', 3, 2, 3),
(1, '2025-01-20', 5, 'Review IT upgrade progress', 2, 1,3),
(1, '2025-01-20', 6, 'Finalize recruitment plan', 1, 3, 4);

SELECT * FROM meetings

-- Insert into users_meeting_attend
INSERT INTO users_meeting_attend (meeting_id, user_id) 
VALUES 
(3, 1),
(4, 2),
(5, 3);

SELECT * FROM users_meeting_attend

-- Insert into users_online_meeting
INSERT INTO users_online_meeting (meeting_id, meeting_link) 
VALUES 
(3, 'https://online-meeting-01.com'),
(5, 'https://online-meeting-02.com'),
(4, 'https://online-meeting-03.com');

SELECT * FROM users_online_meeting