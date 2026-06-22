import { useState } from "react";
import { forgotPassword } from "../services/api";
import "../components/styles/AuthForm.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setIsSubmitting(true);

        try {
            const response = await forgotPassword(email)
            setMessage(response.message);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="login-section">
                    <h2>Forgot Password</h2>
                    <p>Enter your email and we will send a password reset link.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {message && <p className="auth-message success">{message}</p>}
                        {error && <p className="auth-message error">{error}</p>}

                        <button type="submit" className="login-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
