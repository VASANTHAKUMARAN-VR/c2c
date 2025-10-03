import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import SignupForm from "./components/SignupForm";
import ResetPassword from "./components/ResetPassword";
import StudentPage from "./pages/student/StudentPage";
import CompanyPage from "./pages/company/CompanyPage";
import CollegePage from "./pages/college/CollegePage";
import CreateProfile from "./pages/student/CreateProfilePage";
import ViewProfilePage from "./pages/student/ViewProfile";
import PostPage from "./pages/company/PostPage";
import ShortlistPage from "./pages/company/ShortlistPage";
import PosPag from "./pages/college/PostApprovePage";
import NoticePage from "./pages/student/notice";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/college" element={<CollegePage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<StudentPage />} />
        <Route path="/profile" element={<CreateProfile />} />
        <Route path="/profile/view" element={<ViewProfilePage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/shortlist" element={<ShortlistPage />} />
        <Route path="/postapprove" element={<PosPag/>}/>
         <Route path="/NoticePage" element={<NoticePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
