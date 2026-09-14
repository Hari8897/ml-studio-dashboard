import PreprocessData from "../components/Dataset/PreprocessData";
import {Link} from "react-router-dom";
import "../styles/preprocessingPage.css";
import React, { useState } from 'react';


export default function PreprocessingPage({
    datasetId,datasetName,
    overview, columnSummary,
    setOptions, setTarget, 
    handlePreprocess, columns, 
    features, targetData, options,
    }) {

        const [activePreprocessingStep, setActivePreprocessingStep] = useState(); // This should be managed by state in a real application

        const preprocessingSteps = [
            { step: 1, title: "Overview", component: <Overview  overview = {overview} columnSummary = {columnSummary}/> },
            { step: 2, title: "Handle Missing", component: <HandleMissing /> },
            { step: 3, title: "Encode", component: <Encode /> },
            { step: 4, title: "Scale", component: <Scale /> },
            { step: 5, title: "Review", component: <Review  
                setOptions={setOptions} 
                setTarget={setTarget}
                handlePreprocess={handlePreprocess}
                columns = {columns}
                features={features}
                targetData = {targetData}
                options = {options}
                datasetId={datasetId}
                datasetName ={datasetName}/> },
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
        </div>
            
    )
};

const Overview = ({overview, columnSummary}) => {
    const OverviewCards = [
        { label: "Total Rows", value: overview.total_rows },
        { label: "Total Columns", value: overview.total_columns },
        { label: "Missing Values", value: overview.missing_percentage },
        { label: "Categorical Columns", value:overview.categorical_columns },
        { label: "Numerical Columns", value: overview.numerical_columns },
        { label: "Duplicate Rows", value: overview.duplicate_percentage}
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
                        {columnSummary.map((column, index) => (
                            <tr key={index}>
                                <td>{column.name}</td>
                                <td>{column.data_type}</td>
                                <td>{column.missing_values}</td>
                                <td>{column.unique}</td>
                                <td>{Array.isArray(column.sample_values)? column.sample_values.join(", "): column.sample_values ?? "-"}</td> 
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
const Review = ({ 
    setOptions, setTarget, 
    handlePreprocess, columns, 
    features, targetData, options,
    }) => {
    return (
        <>
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
                        {
                        (!columns || columns.length === 0)? (
                            <option value="">Select Target</option>
                        ):(
                            columns.map((col, i) => (
                                <option key={i} value={col}>{col}</option>
                            ))
                        )}
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
        </>
    )
};