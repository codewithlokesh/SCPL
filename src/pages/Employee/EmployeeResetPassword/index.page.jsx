import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getUserAuthData } from "../../../redux/AuthSlice/index.slice";
import { toast } from "react-toastify";
import { AuthServices } from "../../../services/Employee/Auth/index.service";
import "./index.css";

export default function ResetPassword({ onCancel }) {
  const userData = useSelector(getUserAuthData);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = userData?.username || "";

  function validate() {    
    if (!currentPassword) return "Current password is required.";
    if (!newPassword) return "New password is required.";
    if (newPassword.length < 6) return "New password must be at least 6 characters.";
    // if (newPassword === currentPassword) return "New password must be different from current.";
    if (newPassword !== confirmPassword) return "New & Confirm password do not match.";
    return null;
  }


  async function handleSubmit(e) {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);
    try {
      const payload = { userId: userId.trim(), password: currentPassword };
      const loginRes = await AuthServices.Login(payload);
      if (!loginRes || loginRes?.message === "Invalid credentials") {
        toast.error(loginRes?.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // 2) Reset password
      const resetRes = await AuthServices.ResetPassword({ userId: userId.trim(), newPassword });

      if (!resetRes || resetRes?.message === "User not found or inactive") {
        toast.error(resetRes?.message || "Password reset failed.");
      } else {
        toast.success(resetRes?.message || "Password reset successfully.");
        // Optional: clear sensitive fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rp-page">
      <div className="rp-breadcrumb">
        <span>Reset Password</span>
        <span className="rp-divider">/</span>
        <a className="rp-crumb" aria-current="page">Reset Password</a>
      </div>

      <div className="rp-card">
        <div className="rp-card-header">
          <h1 className="rp-title">Reset Password</h1>
        </div>

        <form className="rp-form" onSubmit={handleSubmit}>
          <div className="rp-grid">
            <div className="rp-field">
              <label className="rp-label">
                User Id <span className="rp-required">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., SCPL_Testing"
                className="rp-input"
                value={userId}
                readOnly
                required
                autoComplete="username"
              />
            </div>

            <div className="rp-field">
              <label className="rp-label">
                Current Password <span className="rp-required">*</span>
              </label>
              <input
                type="password"
                placeholder="e.g., Current Password"
                className="rp-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="rp-field">
              <label className="rp-label">New Password</label>
              <input
                type="password"
                placeholder="e.g., New Password"
                className="rp-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="rp-field">
              <label className="rp-label">Confirm Password</label>
              <input
                type="password"
                placeholder="e.g., Confirm Password"
                className="rp-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="rp-actions">
            <button type="submit" className="rp-btn rp-btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" className="rp-btn rp-btn-warning" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
