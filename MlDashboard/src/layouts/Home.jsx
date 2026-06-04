import React from "react"
import "./styles/home.css"

const Home = ({ setActiveStep }) => {
    return (
        <div className="home-header" style={{ padding: "20px" }}>
            <h2>🚀 Ml Data Analysis Dashboard</h2>
            <p style={{ color: "#555", marginBottom: "20px" }}>
             Upload your datset, preprocess it, visualize insights, and train model
            </p>

            {/*Quick action cards*/}
            <div  className="freature-card"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px"
            }} >
                <div className="feature-card" onClick={() => setActiveStep("upload")}>
                    <h3>📂 Upload Data</h3>
                    <p>Start by uploading your dataset (CSV)</p>
                </div>
                <div className="feature-card" onClick={() => setActiveStep("preprocess")}>
                    <h3>🧹 Preprocess</h3>
                    <p>Handle missing values, encoding, scaling</p>
                </div>
                <div className="feature-card" onClick={() => setActiveStep("visualize")}>
                    <h3>📊 Visualize</h3>
                    <p>Explore correlations and patterns</p>
                </div>
                <div className="feature-card" onClick={() => setActiveStep("train")}>
                    <h3>🤖 Train Model</h3>
                    <p>Build ML models automatically</p>
                </div>
                <div className="feature-card" onClick={() => setActiveStep("result")}>
                    <h3>📈 Results</h3>
                    <p>View model performance and insights</p>
                </div>


            </div>

        </div>
    )

}


export default Home;