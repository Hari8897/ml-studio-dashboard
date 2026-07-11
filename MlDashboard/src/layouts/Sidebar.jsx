
import React from "react";
import {
    FaBars,
    FaBell,
    FaBrain,
    FaCalendarAlt,
    FaChartBar,
    FaChartLine,
    FaCloudUploadAlt,
    FaCog,
    FaDatabase,
    FaDownload,
    FaEye,
    FaFlask,
    FaHome,
    FaMoon,
    FaPlay,
    FaRocket,
    FaSearch,
    FaSignOutAlt,
    FaSlidersH,
    FaStar,
    FaTrash,
    FaTrophy,
    FaUser,
    FaProjectDiagram
} from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar=({
    setActiveStep,
    activeStep,
}) => {
    const groups = [
        {
            label:"Main",
            items: [
                ["dashboard", "Dashboard", <FaHome/>],
                ["upload", "Upload Dataset", <FaCloudUploadAlt/>],
                ["preprocess", "Preprocessing", <FaSlidersH/>],
                ["visualize", "Visualize", <FaChartBar/>],
                ["train", "Train Model", <FaPlay/>],
                ["results", "Model Results", <FaChartLine/>],
                ["features", "Feature Importance", <FaStar/>],

            ],
        },
        {
            label: "Account",
            items: [
                ["settings", "Settings", <FaCog />],
                ["profile", "Profile", <FaUser />],
                ["logout", "Logout", <FaSignOutAlt />],
            ],
        },
    ]

    return (
        <div className="studio-sidebar">
            <div className="sidebar-header">
                <ul className="menu">
                {groups.map((group) => (
                    <div key={group.label}>
                        <h3 className="menu-label">{group.label}</h3>
                        {group.items.map(([key, label, icon]) => (
                            <li
                                key={key}
                                className={activeStep === key ? "active" : ""}
                                onClick={() => setActiveStep(key)}
                            >
                                <span className="menu-icon">{icon}</span>
                                <span>{label}</span>
                            </li>
                        ))};
                    </div>
                ))};
                </ul>
                
            </div>
            <div className="upgrade-panel">
                <span>
                    <FaRocket />
                </span>
                <strong>Upgrade to Pro</strong>
                <p>Unlock advanced features and analytics.</p>
                <button type="button">Upgrade Now</button>
            </div>            
        </div>
    );
};

export default Sidebar;
