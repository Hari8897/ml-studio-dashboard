import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../components/styles/AuthForm.css";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = params.token || searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Reset token is missing. Please request a new reset link.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword(token, password);
            alert("Password reset successful");
            navigate("/auth")
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="login-section">
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="password-field">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="eye-icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {error && <p className="auth-message error">{error}</p>}
                        <button type="submit" className="login-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
