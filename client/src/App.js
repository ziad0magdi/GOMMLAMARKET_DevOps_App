import "./App.css";
import { React } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext.js";
import Header from "./Components/Header/Header";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Application from "./Components/Application/Application.js";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp.js";
import MyApplication from "./Pages/MyApplication/MyApplication.js";
import RequestApplication from "./Pages/RequestApplication/RequestAppliction.js";
import MeetingRequest from "./Pages/MeetungRequest/MeetingRequest.js";
import RequestTask from "./Pages/RequestTask/RequestTask.js";
import ApproveAccounts from "./Pages/ApproveAccounts/ApproveAccounts.js";
function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("isLogin") ? (
                <Navigate to="/MyApplication" replace />
              ) : (
                <SignIn />
              )
            }
          />
          <Route path="/SignUp" element={<SignUp />} />
          <Route
            path="/MyApplication"
            element={<ProtectedRoute Component={MyApplication} />}
          />
          <Route
            path="/MeetingRequest"
            element={<ProtectedRoute Component={MeetingRequest} />}
          />
          <Route
            path="/RequestApplication"
            element={<ProtectedRoute Component={RequestApplication} />}
          />
          <Route
            path="/RequestTask"
            element={<ProtectedRoute Component={RequestTask} />}
          />
          <Route
            path="/Application/:application_id"
            element={<ProtectedRoute Component={Application} />}
          />
          <Route
            path="/Empolyees"
            element={<ProtectedRoute Component={ApproveAccounts} />}
          />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}
const ProtectedRoute = ({ Component }) => {
  const { isLogin } = useUser();
  return isLogin ? <Component /> : <Navigate to="/" replace />;
};
export default App;
