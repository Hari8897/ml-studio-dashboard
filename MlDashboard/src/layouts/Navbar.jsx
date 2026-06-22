import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaBolt, FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
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
    const location = useLocation();
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

    const moduleTitle = {
        "/dashboard": "Overview",
        "/upload": "Data Library",
        "/preprocess": "Preprocessing",
        "/visualize": "Visualization",
        "/model": "Model Results",
        "/auth": "Account",
        "/forgot-password": "Account Recovery",
        "/reset-password": "Password Reset",
    }[location.pathname] || "Workspace";

    return (
        <nav className="navbar">
            <div className="logo">
                <button type="button" className="brand-button" onClick={() => navigate("/dashboard")}>
                    <span className="brand-mark">ML</span>
                    <span className="brand-copy">
                        <strong>ML Studio</strong>
                        <small>Dashboard</small>
                    </span>
                </button>
            </div>

            <div className="nav-center">
                <div className="workspace-chip">
                    <FaBolt />
                    <span>{moduleTitle}</span>
                </div>
                <div className="system-status">
                    <span className="status-dot" />
                    <span>Online</span>
                </div>
            </div>

            <div className="nav-actions">
                <button
                    className="icon-action"
                    type="button"
                    aria-label="Notifications"
                    title="Notifications"
                >
                    <FaBell />
                </button>
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



