import { useState, useMemo } from "react";
import PreprocessData from "../components/PreprocessData";
import Table from "../components/Table";
import Results from "../components/Result";
import Heatmap from "../components/Heatmap";
import Home from "./Home";
import "./styles/maincontent.css";
import UploadSection from "../components/UploadFile";


function MainContent({
    activeStep,
    setActiveStep,
    onUpload,
    columns,
    data,
    userDatasets,
    //setUserDatasets,
    selectedDatasetId,
    setSelectedDatasetId, 
    features,
    targetData,
    results,
    options,
    setOptions,
    setTarget,
    handlePreprocess,
    dropColumns,
    setDropColumns,
    handleModelTraining

    // uptonow working fine1
}) {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedColumn, setSelectedColumn] = useState("");


    //const handleDatasetChange = async (e) => {
    //    const datasetId = e.target.value;
    //    console.log("Selected Dataset ID:", datasetId)
    //}


    /* 🔍 Filtering Logic */
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (!searchTerm) return data;

        const lowerSearch = searchTerm.toLowerCase();

        return data.filter((row) => {
            if (selectedColumn) {
                const value = row[selectedColumn];
                return value !== undefined &&
                    String(value).toLowerCase().includes(lowerSearch);
            }

            return columns.some((col) => {
                const value = row[col];
                return value !== undefined &&
                    String(value).toLowerCase().includes(lowerSearch);
            });
        });
    }, [data, searchTerm, selectedColumn, columns]);

    const totalRows = data?.length || 0;
    const filteredRows = filteredData?.length || 0;

    /* 🎯 Step-Based Rendering */
    switch (activeStep) {

        // 🏠 HOME
        case "home":
            return <Home setActiveStep={setActiveStep} />;

        // 📂 UPLOAD / VIEW DATA
        case "upload":
            return (
                <div>                    
                    <section className="section-group">
                        <h3>📂 Upload / View Data</h3>
                        <section className="section-upload">
                            <div className="upload-section">
                                <UploadSection onUpload={onUpload} />
                            </div>
                            <div className="selection-section">
                                <label>Select Datasets: </label>
                                <select
                                    value={selectedDatasetId}
                                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                                >
                                    <option value="">Select Dataset</option>
                                    {userDatasets.map(dataset => (
                                        <option
                                            key={dataset.datasetid}
                                            value={dataset.datasetid}
                                        >
                                            {dataset.datasetname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>
                        
                        
                    </section>
                    {/* 🗃️ Original Data Table */}
                    {data && data.length > 0 && (
                    <section className="section-group">
                        <h3>Original Data Table</h3>

                        <div className="search-filter-box">                          
                            <label >Search By: </label>
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            /> 
                            
                            <label> Search by Column: </label>

                            <select
                                className="column-dropdown"
                                value={selectedColumn}
                                onChange={(e) => setSelectedColumn(e.target.value)}
                            >
                                <option value="">Select Column</option>
                                {columns.map((col, index) => (
                                    <option key={index} value={col}>
                                        {col}
                                    </option>
                                ))}
                            </select>

                            <div className="row-info">
                                <div> Total Rows: <b>{totalRows}</b></div>
                                <div>
                                Filtered Rows: <b>{filteredRows}</b>
                            </div>
                               
                            </div>

                            
                        </div>

                        <Table
                            data={data}
                            columns={columns}
                            filteredData={filteredData}
                        />
                    </section>

                    )}                 

                </div>
            );

        // 🧹 PREPROCESS
        case "preprocess":
            return (
                <div className="main-content" style={{flexDirection: "column"}}>
                    <div className="preprocess-header">
                        <h3>🧹 Preprocessing Controls</h3>
                         <section className="section-group">
                            <label>Target Column </label>
                            <select
                                onChange={(e) => setTarget(e.target.value)}>
                                    <option value="">Select Target </option>
                                    {columns.map((col, i) => (
                                        <option key={i} value={col}>{col}</option>
                                    ))}
                            </select>
                        </section>
                        <section className="section-group-missing">
                                <h4>Missing Handling </h4>
                                <section className="section-group-missing-options">                               
                                    <label>Numerical:</label>
                                    <select
                                        value={options.missing_num}
                                        onChange={(e) =>    
                                                setOptions({ ...options, missing_num: e.target.value }) 
                                            }
                                    >
                                        <option value="mean">Mean</option>
                                        <option value="median">Median</option>
                                        <option value="drop">Drop</option>
                                    </select >
                                    <label>Categorical:</label>
                                    <select
                                        value={options.missing_cat}
                                        onChange={(e) => 
                                            setOptions({ ...options, missing_cat: e.target.value })
                                            } >  
                                                <option value="mode">Mode</option>
                                    </select>

                                </section>

                            </section> 
                            <section className="section-group">
                                <label>Encoding</label>
                                <select
                                    value={options.encoding}
                                    onChange={(e) =>
                                        setOptions({ ...options, encoding: e.target.value })
                                    }  >
                                    <option value="onehot">One-Hot</option>
                                    <option value="label">Label</option>
                                </select>
                            </section>
                            <section className="section-group">
                                <label>Scaling</label>
                                <select
                                    value={options.scaling}
                                    onChange={(e) =>
                                        setOptions({ ...options, scaling: e.target.value })
                                    }
                                >
                                    <option value="none">None</option>
                                    <option value="standard">Standard</option>
                                    <option value="minmax">Min-Max</option>
                                </select>
                            </section>

                            
                         <button className="preprocess-button" onClick={handlePreprocess}>
                                    Run Preprocessing
                        </button>   
                    </div>
                    <div className="preprocess-info">
                        <p><b>Features:</b> {features.length} rows</p>
                        <p><b>Target:</b> {targetData.length} rows</p>
                        <p><b>Missing Num Strategy:</b> {options.missing_num}</p>
                        <p><b>Missing Cat Strategy:</b> {options.missing_cat}</p>
                        <p><b>Encoding:</b> {options.encoding}</p>
                        <p><b>Scaling:</b> {options.scaling}</p>
                    </div>
                    <div className="preprocess-body">
                         <section className="card">
                            <h3>Processed Data Table</h3>
                            <PreprocessData
                                features={features}
                                targetData={targetData}
                            />
                         </section>
                    </div>
                </div>
            );

        // 🤖 MODEL RESULTS
        case "result":
            return (
                <div className="main-content">
                     <h3>📈 Model Training & Results</h3 >                           
                <section className="section-group-results">
                    <label>Drop Unwanted Columns</label>
                    <select 
                        multiple={true} 
                        value={dropColumns}
                        onChange={(e) => {
                                const selectedValues = [...e.target.selectedOptions].map(
                                    (option) => option.value);   
                                setDropColumns(selectedValues);
                            }} >
                            {columns.map((col, i) => (  
                                <option
                                    key={i}
                                    value={col}
                                    >
                                    {col}
                                </option>
                            ))}
                        </select>
                    </section> 
                     <button 
                        className="btn-train" 
                        onClick={() => {
                            handleModelTraining();
                            setActiveStep("result");
                        }}
                        >
                            Train Model
                     </button>
                    <section className="result-card">
                        <Results results={results} />
                    </section>
                </div>
            );

        // 📊 VISUALIZATION
        case "visualize":
            return (
                <div className="main-content">
                    <>
                            <h3>📊 Visualization Controls</h3>
                            <button className="btn" 
                            onClick={() => 
                            setActiveStep("heatmap")
                            }>
                                Show Correlation Heatmap
                            </button>  
                        </> 
                    <section className="card">
                        <h3>Correlation Heatmap</h3>
                        <div className="chart-box">
                            <Heatmap />
                        </div>
                    </section>

                    <section className="card">
                        <h3>Feature Importance Chart</h3>
                        <div className="chart-box">Chart here</div>
                    </section>
                </div>
            );

        default:
            return <Home setActiveStep={setActiveStep} />;
    }
}

export default MainContent;