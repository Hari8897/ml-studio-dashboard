import React from "react";
import { FaChartBar, FaDatabase, FaPlay, FaSlidersH } from "react-icons/fa";
import "./styles/home.css";

const Home = ({ setActiveStep }) => {
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

    return (
        <div className="dashboard-home">
            <section className="page-heading">
                <div>
                    <span className="eyebrow">Machine learning workspace</span>
                    <h1>Build, inspect, and train models from one clean workflow.</h1>
                    <p>Move from dataset upload to preprocessing, visualization, and model results without leaving the dashboard.</p>
                </div>
                <button className="primary-action" type="button" onClick={() => setActiveStep("upload")}>
                    <FaDatabase />
                    Upload Dataset
                </button>
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

export default Home;
