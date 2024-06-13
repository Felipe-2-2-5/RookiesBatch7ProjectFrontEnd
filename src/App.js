import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ManageUserPage from './pages/ManageUserPage';
import ManageAssetPage from './pages/ManageAssetPage';
import ManageAssignmentPage from './pages/ManageAssignmentPage';
import RequestForReturningPage from './pages/RequestForReturningPage';
import ReportPage from './pages/ReportPage';
import CreateUser from './pages/users/CreateUser';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage></HomePage>} />
                <Route path="/login" element={<LoginPage></LoginPage>} />
                <Route path="/manage-user" element={<ManageUserPage></ManageUserPage>} />
                <Route path="/create-user" element={<CreateUser></CreateUser>} />
                <Route path="/manage-asset" element={<ManageAssetPage></ManageAssetPage>} />
                <Route path="/manage-assignment" element={<ManageAssignmentPage></ManageAssignmentPage>} />
                <Route path="/request-for-returning" element={<RequestForReturningPage></RequestForReturningPage>} />
                <Route path="/report" element={<ReportPage></ReportPage>} />
            </Routes>
        </Router>
    );
}

export default App;
