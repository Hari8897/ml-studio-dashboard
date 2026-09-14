import React from "react";
import { FaChartBar, FaDatabase, FaPlay, FaSlidersH,FaCalendarAlt,
    FaBrain, FaTrophy, FaFlask, FaChartLine, FaStar

} from "react-icons/fa";
import "../styles/dashboardoverview.css";
import PageHeader from "../components/DashboardOverview/PageHeader";

const DashboardOverview = () => {
    // const actions = [
    //     {
    //         title: "Upload Data",
    //         text: "Import CSV or Excel files and preview rows before modeling.",
    //         icon: <FaDatabase />,
    //         step: "upload",
    //     },
    //     {
    //         title: "Preprocess",
    //         text: "Choose target columns, handle missing values, encode, and scale.",
    //         icon: <FaSlidersH />,
    //         step: "preprocess",
    //     },
    //     {
    //         title: "Visualize",
    //         text: "Inspect correlations and patterns before training.",
    //         icon: <FaChartBar />,
    //         step: "visualize",
    //     },
    //     {
    //         title: "Train Model",
    //         text: "Run model training and review predictions and feature importance.",
    //         icon: <FaPlay />,
    //         step: "result",
    //     },


    // ];
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
                        <div className="stat-icon-section">
                            <span className={`stat-icon ${stat.color}`}>
                                {stat.icon}
                            </span>
                        </div>

                        <div className="stat-info">
                            <p>{stat.label}</p>
                            <strong>{stat.value}</strong>
                            <small>{stat.description}</small>
                        </div>
                    </article>
                )
                )}
            </section>
            <div className="dashboard-overview">
                <section className="dashboard-overview-left">
                    {/* Top Row */}
                    <div className="dashboard-top">

                        {/* Performance Chart */}
                        <section className="performance-card card">
                            <div className="card-header">
                                <h3 className="card-title">Model Performance Overview</h3>
                                <div className="card-filter">Last 7 days</div>
                            </div>

                            <div className="performance-chart">
                                {/* Chart */}
                            </div>
                        </section>

                        {/* Dataset Distribution */}
                        <section className="distribution-card card">
                            <div className="card-header">
                                <h3 className="card-title">Dataset Distribution</h3>
                            </div>

                            <div className="distribution-chart"></div>
                        </section>

                    </div>

                    {/* Bottom Row */}
                    <div className="dashboard-bottom">
                        <section className="projects-card card">
                            <div className="card-header">
                                <h3 className="card-title">Recent Projects</h3>
                            </div>
                            <table className="projects-table">
                                <thead className="table-head">
                                </thead>
                                <tbody className="table-body">
                                    <tr className="project-row">
                                        <td className="project-name"></td>
                                        <td className="dataset-name"></td>
                                        <td className="model-name"></td>
                                        <td className="accuracy-score"></td>
                                        <td className="status-cell">
                                            <span className="status completed"></span>
                                        </td>
                                        <td className="updated-time"></td>
                                        <td className="action-menu"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="projects-footer">
                                <button className="view-projects-btn">
                                    View All Projects
                                </button>
                            </div>
                        </section>
                    </div>
                </section>

                {/* Activity */}
                <section className="activity-card card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Activities</h3>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon"></div>
                            <div className="activity-content">
                                <h5 className="activity-title"></h5>
                                <p className="activity-description"></p>
                                <span className="activity-time"></span>
                            </div>
                        </div>
                    </div>

                    <button className="activity-btn">
                        View All Activities
                    </button>
                </section>
            </div>
        </div>
    );
};

export default DashboardOverview;
