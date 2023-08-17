import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { connect } from "react-redux";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Chat from "../pages/Chat";
const Router = ({ manager }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={manager.isAuthorized ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/complete-profile" element={<Profile />} />
        {!manager.isAuthorized && (
          <React.Fragment>
            <Route caseSensitive path="/login" element={<Login />} />
            <Route caseSensitive path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </React.Fragment>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

function mapStateToProps(state) {
  const { manager } = state;
  return { manager };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
