import PreprocessData from "../components/Dataset/PreprocessData";
import {Link} from "react-router-dom";
import "../styles/preprocessingPage.css";
import React, { useState } from 'react';



const Overview = () => {
    const OverviewCards = [
        { label: "Total Rows", value: "1000" },
        { label: "Total Columns", value: "20" },
        { label: "Missing Values", value: "5%" },
        { label: "Categorical Columns", value: "8" },
        { label: "Numerical Columns", value: "12" },
        { label: "Duplicate Rows", value: "2%" }
    ]

    const columns = [
        { name: "Age", type: "Numerical", missingValues: "0", uniqueValues: 100, sampleValues: [25, 30, 22, 28, 35] },
        { name: "Gender", type: "Categorical", missingValues: "5", uniqueValues: 2, sampleValues: ["Male", "Female"] },
        { name: "Income", type: "Numerical", missingValues: "0", uniqueValues: 1000, sampleValues: [50000, 60000, 55000, 65000, 70000] },
        { name: "Country", type: "Categorical", missingValues: "2", uniqueValues: 10, sampleValues: ["USA", "Canada", "UK", "Australia", "Germany"] },
        { name: "Purchase Amount", type: "Numerical", missingValues: "0", uniqueValues: 500, sampleValues: [100, 150, 200, 250, 300] }
    ]
    return (
        <>
            <div className="overview-section">
                <h3>Dataset Overview</h3>
                <div className="overview-cards">
                    {OverviewCards.map((card, index) => (
                        <div key={index} className="overview-card">
                            <h4>{card.label}</h4>
                            <p>{card.value}</p>
                        </div>
                    ))}
                </div>
            </div>  
            <div className="overview-column-dataset-table">
                <table className="overview-column-summary-table">
                    <thead>
                        <tr>
                            <th>
                                <span>Column Summary</span>
                            </th>
                        </tr>
                        <tr>
                            <th>Column Name</th>
                            <th>Data Type</th>
                            <th>Missing Values</th>
                            <th>Unique</th>
                            <th>Sample Values</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((column, index) => (
                            <tr key={index}>
                                <td>{column.name}</td>
                                <td>{column.type}</td>
                                <td>{column.missingValues}</td>
                                <td>{column.uniqueValues}</td>
                                <td>{column.sampleValues.join(", ")}</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
        </>
    );
}  
       
const HandleMissing = () => <div className="handle-missing-section">Handle Missing Component</div>;
const Encode = () => <div className="encode-section">Encode Component</div>;
const Scale = () => <div className="scale-section">Scale Component</div>;
const Review = () => <div className="review-section">Review Component</div>;

export default function PreprocessingPage({
    setOptions, setTarget, 
    handlePreprocess, columns, 
    features, targetData, options,
    selectedDatasetId, datasetName}) {

        const [activePreprocessingStep, setActivePreprocessingStep] = useState(); // This should be managed by state in a real application

        const preprocessingSteps = [
            { step: 1, title: "Overview", component: <Overview /> },
            { step: 2, title: "Handle Missing", component: <HandleMissing /> },
            { step: 3, title: "Encode", component: <Encode /> },
            { step: 4, title: "Scale", component: <Scale /> },
            { step: 5, title: "Review", component: <Review /> },
        ];

        const handleClickStep = (step) => {
            // Logic to handle step click, e.g., update state or navigate
            //console.log(`Clicked on step: ${step} ${preprocessingSteps[step - 1]?.title}`);
            setActivePreprocessingStep(step);

            }; 

        const currentStepData = preprocessingSteps.find(item => item.step === activePreprocessingStep);


    return (        
        <div className="workspace-page">
            <div className="workspace-header">
                <div className="workspace-header-content">
                    <h2>Preprocessing</h2>
                    <p>Prepare your dataset for model training by selecting a target column and applying preprocessing strategies.</p>
                </div>
            </div>
            <section>
                <span>Dataset Name: {datasetName}</span>
            </section>
            <section className="preprocessing-steps">
                {preprocessingSteps.map((step) => (
                    <button   
                    className = "preprocessing-step"   
                    key={step.step}
                    onClick={() => handleClickStep(step.step)}
                    >
                        {step.step}.{step.title}
                    </button>
                ))}
            </section>
            <section>
                {currentStepData && (
                    <div className="preprocessing-step-content">
                        {currentStepData.component}
                        <button className="primary-action" type="button" onClick={() => handleClickStep(activePreprocessingStep + 1)}>
                            Next: {preprocessingSteps[activePreprocessingStep]?.title}
                        </button>
                    </div>
                )}  
            </section>
            <section className="page-title">
                <div>
                    <span className="eyebrow">Preprocessing</span>
                    <h1>Prepare data for model training.</h1>
                    <p>Select a target column and apply missing value, encoding, and scaling strategies.</p>
                </div>
                <button className="primary-action" type="button" onClick={handlePreprocess}>
                    Run Preprocessing
                </button>
            </section>

            <section className="panel control-panel">
                <div className="field-group">
                    <label>Target column</label>
                    <select onChange={(e) => setTarget(e.target.value)} required>
                        <option value="">Select Target</option>
                        {columns.map((col, i) => (
                            <option key={i} value={col}>{col}</option>
                        ))}
                    </select>
                </div>
                <div className="field-group">
                    <label>Numerical missing values</label>
                    <select
                        value={options.missing_num}
                        onChange={(e) => setOptions({ ...options, missing_num: e.target.value })}
                        required
                    >
                        <option value="mean">Mean</option>
                        <option value="median">Median</option>
                        <option value="drop">Drop</option>
                    </select>
                </div>
                <div className="field-group">
                    <label>Categorical missing values</label>
                    <select
                        value={options.missing_cat}
                        onChange={(e) => setOptions({ ...options, missing_cat: e.target.value })}
                        required
                    >
                        <option value="mode">Mode</option>
                    </select>
                </div>
                <div className="field-group">
                    <label>Encoding</label>
                    <select
                        value={options.encoding}
                        onChange={(e) => setOptions({ ...options, encoding: e.target.value })}
                        required
                    >
                        <option value="onehot">One-Hot</option>
                        <option value="label">Label</option>
                    </select>
                </div>
                <div className="field-group">
                    <label>Scaling</label>
                    <select
                        value={options.scaling}
                        onChange={(e) => setOptions({ ...options, scaling: e.target.value })}
                        required
                    >
                        <option value="none">None</option>
                        <option value="standard">Standard</option>
                        <option value="minmax">Min-Max</option>
                    </select>
                </div>
            </section>

            <section className="summary-strip">
                <span>Features: <strong>{features?.length || 0}</strong> rows</span>
                <span>Target: <strong>{targetData?.length || 0}</strong> rows</span>
                <span>Encoding: <strong>{options.encoding}</strong></span>
                <span>Scaling: <strong>{options.scaling}</strong></span>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Processed data</h2>
                        <p>Preview of transformed feature and target samples.</p>
                    </div>
                </div>
                <PreprocessData features={features} targetData={targetData} />
            </section>
        </div>
            
    )
}