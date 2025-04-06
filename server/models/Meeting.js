const db = require("../config/db");

class MeetingsModel {
  /*------------------------GET ALL Departments----------------------------------------*/
  static async addLocalMeeting(
    application_id,
    meeting_request_user_id,
    meeting_type,
    meeting_start_date,
    meeting_important_points
  ) {
    try {
      const query = `INSERT INTO meetings 
      (meeting_type, meeting_start_date, meeting_status_id, meeting_important_points, meeting_request_user_id, application_id) 
      VALUES 
      (@meeting_type, @meeting_start_date, @meeting_status_id, @meeting_important_points, @meeting_request_user_id, @application_id)`;
      const params = {
        meeting_type: meeting_type,
        meeting_start_date: meeting_start_date,
        meeting_status_id: 1,
        meeting_request_user_id: meeting_request_user_id,
        application_id: application_id,
        meeting_important_points: meeting_important_points,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Meeting:", err);
      throw err;
    }
  }

  /*------------------------GET Last Meeting Id----------------------------------------*/
  static async GetLastMeeting_Id() {
    try {
      const query = `SELECT TOP 1 meeting_id FROM meetings ORDER BY meeting_id DESC`;
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Meeting:", err);
      throw err;
    }
  }

  /*------------------------Add Online Meeting----------------------------------------*/
  static async addOfflineMeeting(meeting_id, meeting_location_id) {
    try {
      const query = `INSERT INTO users_offline_meeting (meeting_id, meeting_location_id) VALUES (@meeting_id, @meeting_location_id)`;
      const params = {
        meeting_id: meeting_id,
        meeting_location_id: meeting_location_id,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Meeting Link:", err);
      throw err;
    }
  }
  /*------------------------Add Online Meeting----------------------------------------*/
  static async addOnlineMeeting(meeting_id, meetingLink) {
    try {
      const query = `INSERT INTO users_online_meeting (meeting_id, meeting_link) VALUES (@meeting_id, @meetingLink)`;
      const params = {
        meeting_id: meeting_id,
        meetingLink: meetingLink,
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Adding Meeting Link:", err);
      throw err;
    }
  }
  /*------------------------Approve Meeting----------------------------------------*/
  static async approveMeeting(meeting_id, user_id) {
    try {
      const query = `INSERT INTO users_meeting_attend (meeting_id, user_id, is_approve) VALUES (@meeting_id, @user_id, @is_approve)`;
      const params = {
        meeting_id: meeting_id,
        user_id: user_id,
        is_approve: "y",
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Approving Meeting Link:", err);
      throw err;
    }
  }
  /*------------------------Decline Meeting----------------------------------------*/
  static async declineMeeting(meeting_id, user_id) {
    try {
      const query = `INSERT INTO users_meeting_attend (meeting_id, user_id, is_approve) VALUES (@meeting_id, @user_id, @is_approve)`;
      const params = {
        meeting_id: meeting_id,
        user_id: user_id,
        is_approve: "n",
      };
      const result = await db.executeQuery(query, params);
      return result.recordset;
    } catch (err) {
      console.error("Error Declining Meeting Link:", err);
      throw err;
    }
  }
  /*------------------------GET Meeting----------------------------------------*/
  static async getMeetingLocation() {
    try {
      const query = `SELECT * FROM meeting_location`;
      const result = await db.executeQuery(query);
      return result.recordset;
    } catch (err) {
      console.error("Error Getting Meeting:", err);
      throw err;
    }
  }
}

module.exports = MeetingsModel;
