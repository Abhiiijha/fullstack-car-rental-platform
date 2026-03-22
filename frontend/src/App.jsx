import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import CarPage from "./Pages/CarPage.jsx";
import CarDetailsPage from "./Pages/CarDetailsPage.jsx";

import { FaArrowUp } from "react-icons/fa";
import MyBooking from "./Pages/MyBooking.jsx";
import VerifyPaymentPage from "./Pages/VerifyPaymentPage.jsx";

// ✅ PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authToken = localStorage.getItem("token");

  if (!authToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const RedirectIfAuthenticated = ({ children }) => {
  const authToken = localStorage.getItem("tokken");
  if (authToken) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();

  // SCROLL TO TOP ON ROUTE CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // SHOW / HIDE SCROLL BUTTON
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cars" element={<CarPage />} />
        <Route
          path="/cars/:id"
          element={
            <ProtectedRoute>
              <CarDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthenticated>
              <SignUp />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/success" element={<VerifyPaymentPage />} />
        <Route path="/cancel" element={<VerifyPaymentPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showButton && (
        <button
          onClick={scrollUp}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg hover:from-orange-700 hover:to-orange-800 transition-colors focus:outline-none"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default App;
