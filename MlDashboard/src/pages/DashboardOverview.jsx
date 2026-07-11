import React from "react";
import { FaChartBar, FaDatabase, FaPlay, FaSlidersH,FaCalendarAlt,
    FaBrain, FaTrophy, FaFlask, FaChartLine, FaStar

} from "react-icons/fa";
import "../styles/dashboardoverview.css";
import PageHeader from "../components/DashboardOverview/PageHeader";

const DashboardOverview = ({ setActiveStep }) => {
    const actions = [
        {
            title: "Upload Data",
            text: "Import CSV or Excel files and preview rows before modeling.",
            icon: <FaDatabase />,
            step: "upload",
        },
        {
            title: "Preprocess",
            text: "Choose target columns, handle missing values, encode, and scale.",
            icon: <FaSlidersH />,
            step: "preprocess",
        },
        {
            title: "Visualize",
            text: "Inspect correlations and patterns before training.",
            icon: <FaChartBar />,
            step: "visualize",
        },
        {
            title: "Train Model",
            text: "Run model training and review predictions and feature importance.",
            icon: <FaPlay />,
            step: "result",
        },


    ];
    const stats = [
        { label: "Datasets", value: "12", description: "2 this week", icon: <FaDatabase />, color: "purple" },
        { label: "Models Trained", value: "7", description: "1 this week", icon: <FaBrain />, color: "green" },
        { label: "Best Accuracy", value: "94.3%", description: "XGBoost Classifier", icon: <FaTrophy />, color: "blue" },
        { label: "Experiments", value: "15", description: "3 this week", icon: <FaFlask />, color: "orange" },
        { label: "Total Predictions", value: "3,245", description: "12% this week", icon: <FaChartLine />, color: "violet" },
    ];

    return (
        <div className="dashboard-home">
            <PageHeader 
                title="Dashboard"
                subtitle="Welcome back, Hari!👋 Here's what's happening with your ML projects today."
            >
                <button className="date-button" type="button">
                <FaCalendarAlt /> 09 July 2026
            </button>
            </PageHeader> 
            <section className="stat-grid">
                {stats.map((stat)=>(
                    <article className="stat-card" key={stat.label}>
                        <span className={`stat-icon ${stat.color}`}>
                            {stat.icon}
                        </span>
                        <div>
                            <p>{stat.label}</p>
                            <strong>{stat.value}</strong>
                            <small>{stat.description}</small>
                        </div>
                    </article>
                )
                )}
            </section>
            <section className="metric-grid">

                <div className="metric-card">
                    <span>Workflow</span>
                    <strong>5 Steps</strong>
                    <p>Upload to results</p>
                </div>
                <div className="metric-card">
                    <span>Supported Files</span>
                    <strong>CSV, XLSX</strong>
                    <p>Preview before training</p>
                </div>
                <div className="metric-card">
                    <span>Processing</span>
                    <strong>Ready</strong>
                    <p>Missing values, encoding, scaling</p>
                </div>
                <div className="metric-card">

                </div>
                <div className="metric-card">

                </div>
            </section>

            <section className="page-heading">
                <button className="primary-action" type="button" onClick={() => setActiveStep("upload")}>
                    <FaDatabase />
                    Upload Dataset
                </button>
            </section>



            <section className="action-grid">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        className="action-card"
                        type="button"
                        onClick={() => setActiveStep(action.step)}
                    >
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-title">{action.title}</span>
                        <span className="action-text">{action.text}</span>
                    </button>
                ))}
            </section>
        </div>
    );
};

export default DashboardOverview;
