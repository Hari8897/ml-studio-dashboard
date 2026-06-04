import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProcessedData, fetchSelectTargetData, trainModel } from "../services/api";
import Sidebar from "../layouts/Sidebar";
import MainContent from "../layouts/MainContent";
import Navbar from "../layouts/Navbar";
import "./styles.css";
import AuthForm from "../components/Register";


const ROUTE_STEPS = {
    "/upload": "upload",
    "/preprocess": "preprocess",
    "/visualize": "visualize",
    "/model": "result",
};

const STEP_ROUTES = {
    home: "/dashboard",
    upload: "/upload",
    preprocess: "/preprocess",
    visualize: "/visualize",
    result: "/model",
};


function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const activeStep = ROUTE_STEPS[location.pathname] || "home";
    const setActiveStep = (step) => navigate(STEP_ROUTES[step] || "/dashboard");
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [target, setTarget] = useState("");
    const [features, setFeatures] = useState([]);
    const [targetData, setTargetData] = useState([]);
    const [isPreprocessed, setIsPreprocessed] = useState(false);
    const [options, setOptions] = useState({
        missing_num: "mean",
        missing_cat: "mode",
        encoding: "label",
        scaling:"none",
    })
    const [results, setResults] = useState([])
    const [dropColumns, setDropColumns] = useState([])


    const handleUpload = (data) => {
        if (!data || data.error) {
            console.error("Backend error", data?.error);
            return;
        };
        setColumns(data.columns);
        setTableData(data.preview);
    };


    useEffect(() => {
        if (!target || tableData.length === 0 || isPreprocessed) return;

        fetchSelectTargetData(tableData, target).then((result) => {
            setFeatures(result.features);
            setTargetData(result.target);
            
        });
    }, [target, tableData, isPreprocessed]);

    const handlePreprocess = async () => {
        const result = await fetchProcessedData(features, targetData, options)

        //const result = res.json();

        //if (!result) return;
        setFeatures(result.features || []);
        setTargetData(result.target || []);
        setIsPreprocessed(true);
    };

    //console.log("Features: ", features)
    //console.log("TargetData: ", targetData)       
       
    const handleSelectDropColumns = (e) => {
        const selectedValues = Array.from(
            e.target.selectedOptions,
            option => option.value
        );
        setDropColumns(selectedValues);
    };

    const formatFeatures = (data, columns) => {
        return data.map(row =>
            columns.map(col => {
                const val = Number(row[col]);
                return isNaN(val) ? 0 : val;
            })
        );
    };

    const formatTarget = (targetData, targetColumn) => {
        return targetData.map(row => {
            const val = Number(row[targetColumn]);
            return isNaN(val) ? 0 : val;
        });
    };

    const featureColumns = columns.filter(col => col !== target);
    const handleModelTraining = async () => {
        console.log("train button clicked.")

        const filteredColumns = featureColumns.filter(
            col => !dropColumns.includes(col)
        );

        console.log("Filtered Columns:", filteredColumns);
       
        //convert data
        const formattedFeatures = formatFeatures(features, filteredColumns);
        const formattedTarget = formatTarget(targetData, target);

        console.log("Sending Data:", {
            features: formattedFeatures.slice(0,2),
            target: formattedTarget.slice(0, 2),
            featureNames: filteredColumns,
        });
      
        console.log("target:", target);
        console.log("sample targetData row:", targetData[0]);

        const response = await trainModel(
            formattedFeatures,
            formattedTarget,
            filteredColumns,
        );


        console.log("Train Response:", response);

        if (response) {
            setResults(response);
            console.log("reults updated successfully!", setResults);
        } else {
            console.error("training failed at handlemodeltraining.")
        }
    };       

   


    return (
        <div className="dashboard-container">
           <div className="navbar-container">


           </div>
               
            <div className="dashboard-body">
                <div className="sidebar-container">
                    <Sidebar
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    onUpload={handleUpload}
                    columns={columns}
                    
                    options={options}
                    setOptions={setOptions}
                    dropColumns={dropColumns}
                    handlePreprocess={handlePreprocess}
                    setDropColumns={setDropColumns}
                    handleSelectDropColumn={handleSelectDropColumns}
                    handleModelTraining={handleModelTraining} />

                </div>

                <div className="main-content-container">
                    <MainContent
                    columns={columns}
                    data={tableData}
                    features={features}
                    targetData={targetData}
                    results={results}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    onUpload={handleUpload}
                    setTarget={setTarget}
                    options={options}
                    setOptions={setOptions}
                    handlePreprocess={handlePreprocess}
                    dropColumns={dropColumns}
                    setDropColumns={setDropColumns}
                    handleModelTraining={handleModelTraining}
                    />

                </div>                 
            </div>
            
        </div>
    );
}

export default Dashboard;
