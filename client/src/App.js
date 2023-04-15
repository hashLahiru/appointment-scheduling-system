import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyOfficer from "./pages/ApplyOfficer";
import Notifications from "./pages/Notifications";
import UsersList from "./pages/Admin/UsersList";
import OfficersList from "./pages/Admin/OfficersList";
import Profile from "./pages/Officer/Profile";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import OfficerAppointments from "./pages/Officer/OfficerAppointments";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register/>
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-officer"
          element={
            <ProtectedRoute>
              <ApplyOfficer/>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/userslist"
          element={
            <ProtectedRoute>
              <UsersList/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/officerslist"
          element={
            <ProtectedRoute>
              <OfficersList/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment/:officerId"
          element={
            <ProtectedRoute>
              <BookAppointment/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/appointments"
          element={
            <ProtectedRoute>
              <OfficerAppointments/>
            </ProtectedRoute>
          }
        />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;