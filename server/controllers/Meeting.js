const MeetingsModel = require("../models/Meeting");

class MeetingsController {
  static async addMeeting(req, res) {
    const {
      application_id,
      meeting_request_user_id,
      meeting_type,
      meeting_start_date,
      meeting_important_points,
      meetingLocation,
      meetingLink,
    } = req.body;
    try {
      const resulte = await MeetingsModel.addLocalMeeting(
        application_id,
        meeting_request_user_id,
        meeting_type,
        meeting_start_date,
        meeting_important_points
      );

      if (meeting_type === true) {
        const lastMeetingId = await MeetingsModel.GetLastMeeting_Id();
        const meeting_id = lastMeetingId[0].meeting_id ?? 1;

        const resulte = await MeetingsModel.addOnlineMeeting(
          meeting_id,
          meetingLink
        );
      } else {
        const lastMeetingId = await MeetingsModel.GetLastMeeting_Id();
        const meeting_id = lastMeetingId[0].meeting_id ?? 1;

        const resulte = await MeetingsModel.addOfflineMeeting(
          meeting_id,
          meetingLocation
        );
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("Error adding Meeting:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  static async getMeetingLocation(req, res) {
    try {
      const resulte = await MeetingsModel.getMeetingLocation();
      return res.json(resulte);
    } catch (error) {
      console.error("Error Fetching Meeting Locations:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }

  static async approveMeeting(req, res) {
    const meeting_id = req.body.meeting_id;
    const user_id = Number(req.body.user_id);
    try {
      const resulte = await MeetingsModel.approveMeeting(meeting_id, user_id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Approve Meeting:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }
  static async declineMeeting(req, res) {
    const meeting_id = req.body.meeting_id;
    const user_id = Number(req.body.user_id);
    try {
      const resulte = await MeetingsModel.declineMeeting(meeting_id, user_id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error Decline Meeting:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  }
}

module.exports = MeetingsController;
