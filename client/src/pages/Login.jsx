import { Mail, User2Icon, Lock } from "lucide-react";
import React from "react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(urlState || "login");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: ""
  });

  const [showForgot, setShowForgot] = React.useState(false);
  const [resetStep, setResetStep] = React.useState(1); // 1: Email, 2: Token+NewPass
  const [resetData, setResetData] = React.useState({
    email: "",
    token: "",
    newPassword: ""
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    if (showForgot) {
      setResetData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  // HANDLE FORGOT SUBMIT
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (resetStep === 1) {
        const { data } = await api.post("/api/users/forgot-password", { email: resetData.email });
        toast.success(data.message);
        setResetStep(2);
      } else {
        const { data } = await api.post("/api/users/reset-password", {
          token: resetData.token,
          newPassword: resetData.newPassword
        });
        toast.success(data.message);
        setShowForgot(false);
        setResetStep(1);
        setState("login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    }
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // SEND ONLY REQUIRED DATA
      const payload =
        state === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const { data } = await api.post(`/api/users/${state}`, payload);

      dispatch(login(data));
      localStorage.setItem("token", data.token);

      toast.success(data.message);
      navigate("/app");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (showForgot) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form
          onSubmit={handleForgotSubmit}
          className="sm:w-[400px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm"
        >
          <h1 className="text-gray-900 text-3xl font-medium">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-2">
            {resetStep === 1 ? "Enter your email to receive a code" : "Enter the code and your new password"}
          </p>

          {resetStep === 1 ? (
            <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <Mail size={13} color="#6B7280" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="border-none outline-none ring-0 w-full"
                value={resetData.email}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <>
              <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <Lock size={13} color="#6B7280" />
                <input
                  type="text"
                  name="token"
                  placeholder="Reset Code"
                  className="border-none outline-none ring-0 w-full"
                  value={resetData.token}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <Lock size={13} color="#6B7280" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="border-none outline-none ring-0 w-full"
                  value={resetData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="mt-8 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity font-medium"
          >
            {resetStep === 1 ? "Get Code" : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => { setShowForgot(false); setResetStep(1); }}
            className="text-gray-500 text-sm mt-4 hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state} to continue
        </p>

        {/* NAME FIELD ONLY IN REGISTER */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* EMAIL FIELD */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD FIELD */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left text-green-500">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-sm"
          >
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-green-500 hover:underline">click here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
