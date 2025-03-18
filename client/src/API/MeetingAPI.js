import axios from "./axios";

const AddMeeting = (
  application_id,
  meeting_request_user_id,
  meeting_type,
  meeting_start_date,
  meeting_important_points,
  meetingLink
) =>
  axios.post("/AddMeeting", {
    application_id: application_id,
    meeting_request_user_id: meeting_request_user_id,
    meeting_type: meeting_type,
    meeting_start_date: meeting_start_date,
    meeting_important_points: meeting_important_points,
    meetingLink: meetingLink,
  });
const ApproveMeeting = (meeting_id, user_id) =>
  axios.post("/approveMeeting", { meeting_id: meeting_id, user_id: user_id });
const DeclineMeeting = (meeting_id, user_id) =>
  axios.post("/declineMeeting", { meeting_id: meeting_id, user_id: user_id });
const MeetingAPI = {
  AddMeeting,
  ApproveMeeting,
  DeclineMeeting,
};
export default MeetingAPI;
