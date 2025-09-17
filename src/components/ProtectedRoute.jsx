import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("❌ Please login first");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500); // small delay to allow toast to show
    }
  }, [user, navigate]);

  if (!user) return null; // render nothing while waiting

  return children;
};

export default ProtectedRoute;
