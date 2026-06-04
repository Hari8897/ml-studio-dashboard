
import React from "react";
import UploadSection from "../components/UploadFile";
import "./styles/sidebar.css";

const Sidebar=({
    setActiveStep,
    // activeStep,
    // onUpload,
    // columns,
    // setTarget, options,
    // setOptions,
    // setDropColumns,
    // dropColumns,
    // handlePreprocess,
    // handleModelTraining,

    // uptonow working fine1
}) => {
    
    // const steps = [
    //     {key: "home", label: "🏠Home"},
    //     {key: "upload", label: "📂Upload / View Data"},
    //     {key: "preprocess", label: "🧹Preprocess Data"},
    //      { key: "visualize", label: "📊 Visualize" },
    //     {key: "results", label: "📈Results"},
    //     {key: "heatmap", label: "Correlation Heatmap"},

    // ];

    return (
        <div className="sidebar">
             <h2 className="logo"> Controls</h2>  

            {/*  Navigation */}  
            <ul className="menu">
                <li onClick={()=> setActiveStep("home")}>🏠Home</li>
                <li onClick={()=> setActiveStep("upload")}>📂Upload / View Data</li>
                <li onClick={()=> setActiveStep("preprocess")}>🧹Preprocess Data</li>
                <li onClick={()=> setActiveStep("visualize")}>📊 Visualize</li>
                <li onClick={()=> setActiveStep("result")}>📈Results</li>
                {/* <li onClick={()=> setActiveStep("heatmap")}>Correlation Heatmap</li> */}
            </ul>

            <hr className="divider" /> 

            {/*Step based controls */} 

            {/*Upload Section */}  

            {/* {activeStep === "upload" && (
                <section className="section-group">
                    <h3>📂 Upload / View Data</h3>
                    <UploadSection onUpload={onUpload} />
                </section>
            )}      */}
           
            {/* {activeStep === "preprocess" && (
                    <>
                        <h3>🧹 Preprocessing Controls</h3>

                            <section className="section-group">
                                <label>Target Column </label>
                                <select onChange={(e) => setTarget(e.target.value)}>
                                    <option value="">Select Target </option>
                                    {columns.map((col, i) => (
                                        <option key={i} value={col}>{col}</option>
                                    ))}
                                </select>
                            </section>
                            
                            <section className="section-group">
                                <h4>Missing Handling </h4>
                                <label>Numerical</label>
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
                                <label>Categorical</label>
                                <select
                                    value={options.missing_cat}
                                    onChange={(e) => 
                                        setOptions({ ...options, missing_cat: e.target.value })
                                        } >  
                                            <option value="mode">Mode</option>
                                </select>
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
                                    onChange={(e) => setOptions({ ...options, scaling: e.target.value })
                                }
                                >
                                    <option value="standard">StandardScaler</option>
                                    <option value="none">None</option>
                                    <option value="minmax">MinMaxScaler</option>
                                </select>
                            </section>
                             <button className="btn" 
                                onClick={() => {
                                    handlePreprocess();
                                    setActiveStep("preprocess");
                                }}>
                                    Run Preprocess
                                    
                                    </button>

                            </>
            )} */}

            {/* Visualization step */}
            {/* {activeStep === "visualize" && (
                        <>
                            <h3>📊 Visualization Controls</h3>
                            <button className="btn" 
                            onClick={() => 
                            setActiveStep("heatmap")
                            }>
                                Show Correlation Heatmap
                            </button>  
                        </> 
            )} */}

            {/* Model Training Step */}
            {/*{activeStep === "result" && (
                <>
                {/* <h3>📈 Model Training & Results</h3 >                           
                <section className="section-group">
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
                        className="btn train" 
                        onClick={() => {
                            handleModelTraining();
                            setActiveStep("result");
                        }}
                        >
                            Train Model
                     </button> 
                           
                </>
            )} */}  
        </div>
    );
};

export default Sidebar;
