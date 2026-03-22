import React, { useEffect, useState, useRef } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaEye,
  FaCheck,
} from "react-icons/fa";
import logo from "../assets/logocar.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Auto-focus email input
    emailRef.current?.focus();

    // Check if remembered credentials exist
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRemember = localStorage.getItem("rememberMe");
    if (savedEmail && savedRemember === "true") {
      setCredentials((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    setIsActive(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above", { theme: "colored" });
      return;
    }

    setLoading(true);

    try {
      // ✅ Environment variable
      const res = await axios.post(`${API_URL}/api/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status >= 200 && res.status < 300) {
        const { token, user, message } = res.data || {};

        // Store auth data
        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        // Remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", credentials.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.setItem("rememberMe", "false");
        }

        toast.success(message || "Login Successful! Welcome back 🚗", {
          autoClose: 1200,
          theme: "colored",
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        setTimeout(() => navigate(from, { replace: true }), 1300);
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        toast.error("Invalid email or password", { theme: "colored" });
      } else if (err.response) {
        toast.error(err.response.data?.message || "Login failed", {
          theme: "colored",
        });
      } else if (err.request) {
        toast.error("No response from server. Is backend running?");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      {/* Animated Background */}
      <div className={loginStyles.animatedBackground.base}>
        <div
          className={`${loginStyles.animatedBackground.orb1} ${
            isActive ? "translate-x-20 translate-y-10" : ""
          }`}
        />
        <div
          className={`${loginStyles.animatedBackground.orb2} ${
            isActive ? "-translate-x-20 -translate-y-10" : ""
          }`}
        />
        <div
          className={`${loginStyles.animatedBackground.orb3} ${
            isActive ? "-translate-x-10 translate-y-20" : ""
          }`}
        />
      </div>

      {/* Back Button */}
      <button onClick={() => navigate("/")} className={loginStyles.backButton}>
        <FaArrowLeft />
        <span>Back to Home</span>
      </button>

      {/* Login Card */}
      <div
        className={`${loginStyles.loginCard.container} ${
          isActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className={loginStyles.loginCard.card}>
          <div className={loginStyles.loginCard.decor1} />
          <div className={loginStyles.loginCard.decor2} />

          {/* Header */}
          <div className={loginStyles.loginCard.headerContainer}>
            <div className={loginStyles.loginCard.logoContainer}>
              <div className={loginStyles.loginCard.logoText}>
                <img
                  src={logo}
                  alt="logo"
                  className="h-[1em] w-auto block"
                  style={{ objectFit: "contain" }}
                />
                <span className="font-bold tracking-wider">KARZONE</span>
              </div>
            </div>

            <h1 className={loginStyles.loginCard.title}>PremiumDrive</h1>
            <p className={loginStyles.loginCard.subtitle}>
              LUXURY MOBILITY EXPERIENCE
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={loginStyles.form.container}>
            {/* Email */}
            <div className={loginStyles.form.inputContainer}>
              <div className={loginStyles.form.inputWrapper}>
                <div className={loginStyles.form.inputIcon}>
                  <FaUser />
                </div>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  className={`${loginStyles.form.input} ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className={loginStyles.form.inputContainer}>
              <div className={loginStyles.form.inputWrapper}>
                <div className={loginStyles.form.inputIcon}>
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  className={`${loginStyles.form.input} ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <div
                  onClick={togglePasswordVisibility}
                  className={loginStyles.form.passwordToggle}
                  style={{ cursor: "pointer" }}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 text-orange-500 rounded"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-xs text-orange-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={loginStyles.form.submitButton}
            >
              <span className={loginStyles.form.buttonText}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2" />
                    Logging in...
                  </>
                ) : (
                  "ACCESS PREMIUM GARAGE"
                )}
              </span>
              <div className={loginStyles.form.buttonHover} />
            </button>
          </form>

          {/* Signup */}
          <div className={loginStyles.signupSection}>
            <p className={loginStyles.signupText}>Don't have an account?</p>
            <button
              onClick={() => navigate("/signup")}
              className={loginStyles.signupButton}
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
        limit={1}
      />
    </div>
  );
};

export default Login;
