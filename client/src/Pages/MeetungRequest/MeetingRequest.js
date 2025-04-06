import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MeetingRequest.css";
import { useUser } from "../../context/UserContext";
import MeetingAPI from "../../API/MeetingAPI";
const MeetingRequest = () => {
  const location = useLocation();
  const { isDarkMode, language, user_Id } = useUser();
  console.log("User ID:", user_Id);
  const application_id = location.state?.application_id;
  const [meetingLocations, setMeetingLocations] = useState([]);
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingType, setMeetingType] = useState(false);
  const [meetingStartDate, setMeetingStartDate] = useState("");
  const [meetingImportantPoints, setMeetingImportantPoints] = useState("");
  useEffect(() => {
    const fetchMeetingLocations = async () => {
      try {
        const response = await MeetingAPI.GetMeetingLocation();
        setMeetingLocations(response.data);
      } catch (error) {
        console.error("Error fetching meeting locations:", error);
      }
    };
    fetchMeetingLocations();
  }, []);
  const toggleMeetingType = () => {
    setMeetingType((prev) => !prev);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      MeetingAPI.AddMeeting(
        application_id,
        user_Id,
        meetingType,
        meetingStartDate,
        meetingImportantPoints,
        Number(meetingLocation),
        meetingLink
      );
      alert("Meeting request submitted successfully!");
    } catch (error) {
      console.error("Error submitting Meeting request:", error);
    }
  };
  return (
    <div
      className={`MeetingRequest ${
        isDarkMode ? "MeetingRequest_dark" : "MeetingRequest_light"
      }`}
    >
      <h1 className="MeetingRequest_title">
        {language === "en" ? "Create Meeting Request" : "إنشاء طلب اجتماع"}
      </h1>
      <form className="MeetingRequest_form" onSubmit={handleSubmit}>
        <div className="MeetingRequest_field">
          <label htmlFor="meeting_start_date">
            {language === "en" ? "Meeting Start Date:" : "تاريخ بدء الاجتماع:"}
          </label>
          <input
            type="date"
            id="meeting_start_date"
            name="startDate"
            value={meetingStartDate}
            onChange={(e) => setMeetingStartDate(e.target.value)}
          />
        </div>
        <div className="MeetingRequest_field">
          <label htmlFor="meeting_important_points">
            {language === "en"
              ? "Meeting Important Points:"
              : "النقاط الهامة للاجتماع:"}
          </label>
          <textarea
            id="importantPoints"
            name="meeting_important_points"
            value={meetingImportantPoints}
            onChange={(e) => setMeetingImportantPoints(e.target.value)}
          ></textarea>
        </div>
        <div className="MeetingRequest_field">
          <button
            type="button"
            className="MeetingRequest_toggle"
            onClick={toggleMeetingType}
          >
            {meetingType
              ? language === "en"
                ? "Switch to Offline Meeting"
                : "الإجتماع في قاعة الإجتماعات"
              : language === "en"
              ? "Switch to Online Meeting"
              : "الإجتماع عبر الأنترنت"}
          </button>
        </div>

        {!meetingType && (
          <div className="MeetingRequest_field">
            <label htmlFor="meetingLocation">
              {language === "en"
                ? "Select Meeting Location:"
                : "اختر مكان الاجتماع:"}
            </label>
            <select
              id="meetingLocation"
              name="meetingLocation"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
            >
              <option value="" disabled>
                {language === "en" ? "Select Location" : "اختر المكان"}
              </option>
              {meetingLocations.map((location) => (
                <option
                  key={location.meeting_location_id}
                  value={location.meeting_location_id}
                >
                  {location.meeting_location}
                </option>
              ))}
            </select>
          </div>
        )}

        {meetingType && (
          <div className="MeetingRequest_field">
            <label htmlFor="meetingLink">
              {language === "en" ? "Meeting Link:" : "رابط الاجتماع:"}
            </label>
            <input
              type="text"
              id="meetingLink"
              name="meetingLink"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder={
                language === "en"
                  ? "Enter online meeting link"
                  : "أدخل رابط الاجتماع"
              }
            />
          </div>
        )}

        <button type="submit" className="MeetingRequest_submit">
          {language === "en" ? "Submit Request" : "إرسال الطلب"}
        </button>
      </form>
    </div>
  );
};

export default MeetingRequest;
