import './styles/AuthForm.css'

import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser } from "../services/api";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


function AuthForm (){
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            // Login flow
            try {
                const loginData = await loginUser({
                    email: formData.email,
                    password: formData.password
                });
                alert(JSON.stringify(loginData, null, 2))
                // console.log("Login Data:", loginData);
                
                if (loginData.error) {
                    alert(loginData.error);
                    return;
                }
                // console.log("Login Response:", loginData);
                const user = loginData.user;
                //console.log("User:", user);
                
                if (!user || !user.id) {
                    console.error("Login response: ", loginData);
                    alert("Login response is missing user details.");
                    return;
                }
                // 
                localStorage.setItem(
                    "user", 
                    JSON.stringify(user)
                ); 
                window.dispatchEvent(new Event("user-updated"));
                //alert("Login successful!");
                //alert("Reached here successfully");

                console.log(
                    "Stored User:",
                    JSON.parse(localStorage.getItem("user"))
                );
                alert("Login successful!");
                navigate("/dashboard");
                // Handle successful login (e.g., store token, redirect)
            } catch (error) {
                console.error("Login Error:", error); 
                alert("Login Failed!")
                // Handle login error
            }
        } else {
            // Registration flow
            try {
                const registrationData = await registerUser(
                    formData);
                    if (registrationData.error) {
                        alert(registrationData.error);
                        return;
                }
                alert("Registration successful! Please login.");
                setIsLogin(true); // Switch to login after successful registration
            }
            catch (error) {
                console.error("Registration Error:", error);
                alert("Registration failed. Please try again.");
                // Handle registration error 
            }         
        }
    }; 





    return  (
        <div className="auth-container">
            <div className="auth-box">
                {/*Login Section */}
                <div className="login-section">
                    <h2>{isLogin ? "Login" : "Register"}</h2>
                    <p>{isLogin ? "Welcome back! Please login to your account." : "Welcome!  Please Register your account.."}</p>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="input-group">
                                <label>Username</label>
                                <input 
                                    type="text"
                                    name='username'
                                    placeholder="Enter your username."
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        )}


                        <div className="input-group">
                            <label>Email</label>
                            <input 
                                type = "email" 
                                name = "email"
                                placeholder="Enter your email..."
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>

                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                        {isLogin && (
                            <div className="forgot-password">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                        ) }

                        <button type = "submit" className="login-btn">
                                {isLogin ?  "Login" : "Register"}
                        </button>
                    </form>

                    <p className="toggle-text">
                        {isLogin 
                        ? "Don't have an account?"
                        : "Already have an account?"}

                        <span 
                        className="toggle-link" 
                        onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? <a href="#"> Register here.</a>  : <a href="#"> Login here.</a>}
                        </span>
                    </p>
                </div>          
            </div>
        </div>
    
    ) 
};

export default AuthForm;
