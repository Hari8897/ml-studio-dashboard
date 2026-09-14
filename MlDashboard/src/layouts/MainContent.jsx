import { useMemo, useState } from "react";
import Results from "../components/Model/Result";
import Home from "../pages/DashboardOverview";
import "../styles/maincontent.css";
import { useNavigate } from "react-router-dom";
import PreprocessingPage from "../pages/PreprocessingPage";
import UploadPage from "../pages/UploadPage";
import VisualizationPage from "../pages/VisualizationPage";

function MainContent({
    activeStep,
    setActiveStep,
    onUpload,
    columns,
    data,
    datasetName,
    userDatasets,
    selectedDatasetId,
    setSelectedDatasetId,
    overview,
    columnSummary,
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
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedColumn, setSelectedColumn] = useState("");

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

    const navigate = useNavigate();
    const openDataset = (datasetId) => {
        const dataset = userDatasets.find(ds => ds.dataset_id === datasetId);
        if (!dataset) {
            console.error("Dataset not found:", datasetId);
            return;
        }
        setSelectedDatasetId(datasetId);


        navigate("/preprocess", {
            state:{
                datasetId:datasetId
            }
        })
    }

    

    switch (activeStep) {
        case "dashboard":
            return <DashboardOverview setActiveStep={setActiveStep} />;

        case "upload":
            return (<UploadPage 
                onUpload={onUpload} 
                data={data} 
                userDatasets={userDatasets} 
                openDataset={openDataset} 
                columns={columns} 
                totalRows={totalRows} 
                filteredRows={filteredRows} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                selectedColumn={selectedColumn} 
                setSelectedColumn={setSelectedColumn} 
                filteredData={filteredData} 
                selectedDatasetId={selectedDatasetId} 
                setSelectedDatasetId={setSelectedDatasetId}/>);
;

        case "preprocess":
            return <PreprocessingPage
            datasetId = {selectedDatasetId} 
            datasetName = {datasetName}
            overview = {overview}
            columnSummary = {columnSummary}
            tableData = {data}
            setOptions={setOptions} 
            setTarget={setTarget} 
            handlePreprocess = {handlePreprocess} 
            columns={columns} 
            features={features} 
            targetData={targetData} 
            options={options}

            />


        case "visualize":
            return (
                <VisualizationPage datasetName={datasetName} columns={columns}/>
            );

        case "train":
            return (<TrainingPage
                columns={columns}
                dropColumns={dropColumns}/>);
                // <div className="workspace-page">
                //     <section className="page-title">
                //         <div>
                //             <span className="eyebrow">Modeling</span>
                //             <h1>Train and review model output.</h1>
                //             <p>Drop unwanted columns, train the model, then inspect score, predictions, and feature importance.</p>
                //         </div>
                //         <button
                //             className="primary-action"
                //             type="button"
                //             onClick={() => {
                //                 handleModelTraining();
                //                 setActiveStep("train");
                //             }}
                //         >
                //             Train Model
                //         </button>
                //     </section>

                //     <section className="panel">
                //         <div className="panel-header training-header">
                //             <div>
                //                 <h2>Training setup</h2>
                //                 <p>Select columns to remove before training.</p>
                //             </div>
                //             {dropColumns.length > 0 && (
                //                 <button
                //                     className="secondary-action"
                //                     type="button"
                //                     onClick={() => setDropColumns([])}
                //                 >
                //                     Clear
                //                 </button>
                //             )}
                //         </div>

                //         <div className="drop-column-grid" aria-label="Drop unwanted columns">
                //             {columns.length === 0 ? (
                //                 <div className="empty-state">Upload and preprocess a dataset to choose columns.</div>
                //             ) : (
                //                 columns.map((col, i) => {
                //                     const checked = dropColumns.includes(col);

                //                     return (
                //                         <label className="drop-column-option" key={`${col}-${i}`}>
                //                             <input
                //                                 type="checkbox"
                //                                 checked={checked}
                //                                 onChange={(e) => {
                //                                     if (e.target.checked) {
                //                                         setDropColumns([...dropColumns, col]);
                //                                         return;
                //                                     }

                //                                     setDropColumns(dropColumns.filter((column) => column !== col));
                //                                 }}
                //                             />
                //                             <span>{col}</span>
                //                         </label>
                //                     );
                //                 })
                //             )}
                //         </div>

                //         {dropColumns.length > 0 && (
                //             <div className="selected-columns">
                //                 {dropColumns.map((col) => (
                //                     <span key={col}>{col}</span>
                //                 ))}
                //             </div>
                //         )}
                //     </section>

                //     <section className="panel">
                //         <Results results={results} />
                //     </section>
                // </div>



        default:
            return <Home setActiveStep={setActiveStep} />;
    }
}

export default MainContent;
