import PreprocessData from "../components/Dataset/PreprocessData";
import "../styles/preprocessingPage.css";
export default function PreprocessingPage({
    setOptions, setTarget, 
    handlePreprocess, columns, 
    features, targetData, options,
    selectedDatasetId, datasetName}) {

        const preprocessingSteps = [
            { step: 1, title: "Overview" },
            { step: 2, title: "Handle Missing" },
            { step: 3, title: "Encode" },
            { step: 4, title: "Scale" },
            { step: 5, title: "Review" },
        ];

        const handleClickStep = (step) => {
            // Logic to handle step click, e.g., update state or navigate
            console.log(`Clicked on step: ${step} ${preprocessingSteps[step - 1]?.title}`);
             };  


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
                    <button className="preprocessing-step" key={step.step} onClick={() => handleClickStep(step.step)}>
                        {step.step}.{step.title}
                    </button>
                ))}
            </section>
            <section>
            </section>

            <section className="summary-strip">
                
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