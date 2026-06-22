import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
        ;    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/auth/forgot-password`,
                {
                    token,
                    new_password: password
                }
            );
            alert("Password reset successful");
            navigate("/")
        } catch (error) {
            alert("Failed to rest password");
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
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <imput
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="login-btn">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};