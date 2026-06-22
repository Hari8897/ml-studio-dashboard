import { useMemo, useState } from "react";
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

    switch (activeStep) {
        case "home":
            return <Home setActiveStep={setActiveStep} />;

        case "upload":
            return (
                <div className="workspace-page">
                    <section className="page-title">
                        <div>
                            <span className="eyebrow">Data library</span>
                            <h1>Upload and inspect datasets.</h1>
                            <p>Add a dataset, reopen previous uploads, and search through the preview before preprocessing.</p>
                        </div>
                    </section>

                    <section className="panel two-column">
                        <div>
                            <h2>Upload dataset</h2>
                            <UploadSection onUpload={onUpload} />
                        </div>
                        <div className="field-group">
                            <label>Select saved dataset</label>
                            <select
                                value={selectedDatasetId}
                                onChange={(e) => setSelectedDatasetId(e.target.value)}
                            >
                                <option value="">Select Dataset</option>
                                {userDatasets.map(dataset => (
                                    <option key={dataset.datasetid} value={dataset.datasetid}>
                                        {dataset.datasetname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {data && data.length > 0 && (
                        <section className="panel">
                            <div className="panel-header">
                                <div>
                                    <h2>Dataset preview</h2>
                                    <p>{columns.length} columns available for preprocessing.</p>
                                </div>
                                <div className="row-info">
                                    <span>Total: <strong>{totalRows}</strong></span>
                                    <span>Filtered: <strong>{filteredRows}</strong></span>
                                </div>
                            </div>

                            <div className="toolbar">
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search rows"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <select
                                    className="column-dropdown"
                                    value={selectedColumn}
                                    onChange={(e) => setSelectedColumn(e.target.value)}
                                >
                                    <option value="">All columns</option>
                                    {columns.map((col, index) => (
                                        <option key={index} value={col}>{col}</option>
                                    ))}
                                </select>
                            </div>

                            <Table data={data} columns={columns} filteredData={filteredData} />
                        </section>
                    )}
                </div>
            );

        case "preprocess":
            return (
                <div className="workspace-page">
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
                            <select onChange={(e) => setTarget(e.target.value)}>
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
                            >
                                <option value="mode">Mode</option>
                            </select>
                        </div>
                        <div className="field-group">
                            <label>Encoding</label>
                            <select
                                value={options.encoding}
                                onChange={(e) => setOptions({ ...options, encoding: e.target.value })}
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
            );

        case "result":
            return (
                <div className="workspace-page">
                    <section className="page-title">
                        <div>
                            <span className="eyebrow">Modeling</span>
                            <h1>Train and review model output.</h1>
                            <p>Drop unwanted columns, train the model, then inspect score, predictions, and feature importance.</p>
                        </div>
                        <button
                            className="primary-action"
                            type="button"
                            onClick={() => {
                                handleModelTraining();
                                setActiveStep("result");
                            }}
                        >
                            Train Model
                        </button>
                    </section>

                    <section className="panel">
                        <div className="field-group wide-field">
                            <label>Drop unwanted columns</label>
                            <select
                                multiple={true}
                                value={dropColumns}
                                onChange={(e) => {
                                    const selectedValues = [...e.target.selectedOptions].map(
                                        (option) => option.value);
                                    setDropColumns(selectedValues);
                                }}
                            >
                                {columns.map((col, i) => (
                                    <option key={i} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section className="panel">
                        <Results results={results} />
                    </section>
                </div>
            );

        case "visualize":
            return (
                <div className="workspace-page">
                    <section className="page-title">
                        <div>
                            <span className="eyebrow">Visualization</span>
                            <h1>Explore relationships in your dataset.</h1>
                            <p>Use visual checks to understand correlation and feature behavior before training.</p>
                        </div>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <h2>Correlation heatmap</h2>
                                <p>Numeric-column correlation view.</p>
                            </div>
                        </div>
                        <div className="chart-box">
                            <Heatmap />
                        </div>
                    </section>

                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <h2>Feature importance</h2>
                                <p>Feature importance appears after model training.</p>
                            </div>
                        </div>
                        <div className="empty-chart">Train a model to populate this chart.</div>
                    </section>
                </div>
            );

        default:
            return <Home setActiveStep={setActiveStep} />;
    }
}

export default MainContent;
