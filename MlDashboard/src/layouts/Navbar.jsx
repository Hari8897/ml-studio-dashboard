import React from "react";
import { useNavigate, Link } from "react-router-dom";
//import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="logo">
                <h2>ML Studio</h2>
            </div>

            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                <li><Link to="/preprocess">Preprocess</Link></li>
                <li><Link to="/visualize">Visualize</Link></li>
                <li><Link to="/model">Model</Link></li>
            </ul>

            <div className="nav-actions">
                <button className="btn" onClick={() => navigate("/auth")}>Login</button>
            </div>
        </nav>
    );
};

export default Navbar;



