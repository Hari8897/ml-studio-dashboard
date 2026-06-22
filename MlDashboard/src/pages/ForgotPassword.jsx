import { useState } from "react";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await forgotPassword(email)
            alert(response.message);
        } catch (error) {
            console.error(error);
            alert("Failed to send reset link")
        }
    }
    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter your email."
                value={email}
                onChange={(e) => setEmail(e.target.value) }
            />
            <button onClick={handleSubmit}> Send Reset Link</button>

        </div>
    )
}