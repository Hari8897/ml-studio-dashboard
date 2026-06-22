import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./styles/Navbar.css";

const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("user");
        return null;
    }
};

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getStoredUser);

    useEffect(() => {
        const syncUser = () => setUser(getStoredUser());

        window.addEventListener("storage", syncUser);
        window.addEventListener("user-updated", syncUser);

        return () => {
            window.removeEventListener("storage", syncUser);
            window.removeEventListener("user-updated", syncUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.dispatchEvent(new Event("user-updated"));
        navigate("/auth");
    };

    const profileInitial = user?.username?.charAt(0)?.toUpperCase()
        || user?.email?.charAt(0)?.toUpperCase()
        || "";

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
                {user ? (
                    <div className="profile-menu">
                        <div className="profile-avatar">{profileInitial}</div>
                        <div className="profile-info">
                            <span className="profile-name">{user.username || "Profile"}</span>
                            <span className="profile-email">{user.email}</span>
                        </div>
                        <button
                            className="logout-btn"
                            type="button"
                            onClick={handleLogout}
                            aria-label="Logout"
                            title="Logout"
                        >
                            <FaSignOutAlt />
                        </button>
                    </div>
                ) : (
                    <button
                        className="empty-profile"
                        type="button"
                        onClick={() => navigate("/auth")}
                        aria-label="Login"
                        title="Login"
                    >
                        <FaRegUserCircle />
                        <span>Profile</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;



