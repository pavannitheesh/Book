import Login from "@/components/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from './components/Signup';
import Books from "./components/Books";
import AddNewBook from "./components/AddNewBook";
import BookDetail from "./components/BookDetail";
import AdminEditBook from "./components/AdminEditBook";
import { useEffect, useState } from "react";

function App() {
	
		const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
		const isLoggedIn = userInfo.token !== undefined && userInfo.token !== "";
		
	
  

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (accessible regardless of login status) */}
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (only accessible if logged in) */}
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Books />} />
            <Route path="/books" element={<Books />} />
            <Route path="/addbook" element={<AddNewBook />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/edit/:id" element={<AdminEditBook />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/books" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;