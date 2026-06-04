import "./styles/preprocessdata.css"

function PreprocessData({ features = [], targetData = [] }) {

    // ✅ Safe check (no crash)
    if (!features || !targetData) {
        return <p>No processed data available</p>;
    }

    const SAMPLE_SIZE = 8;  


    // rows
    const sampleFeatures = features.slice(0, SAMPLE_SIZE);
    const sampleTarget = targetData.slice(0, SAMPLE_SIZE);

    // columns (features)
    const featureColumns = sampleFeatures.length > 0
        ? Object.keys(sampleFeatures[0])
        : [];

    // 🔥 IMPORTANT FIX: handle target properly
    const formattedTarget = sampleTarget.map((val) =>
        typeof val === "object" ? val : { target: val }
    );

    const targetColumns = formattedTarget.length > 0
        ? Object.keys(formattedTarget[0])
        : [];

    return (
        <div className="preprocess-container">

            {/* 🔹 FEATURES */}
            <h3 className="section-title">Features (X)</h3>
            <div className="table-container">
                {sampleFeatures.length > 0 ? (
                    <table className="table">
                        <thead>    
                            <tr>
                                {featureColumns.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sampleFeatures.map((row, i) => (
                                <tr key={i}>
                                    {featureColumns.map((col, j) => (
                                        <td key={j}>{row[col]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">No feature data</div>
                )}
            </div>

            {/* 🔹 TARGET */}
            <h3 className="section-title">Target (y)</h3>
                {formattedTarget.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                {targetColumns.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {formattedTarget.map((row, i) => (
                                <tr key={i}>
                                    {targetColumns.map((col, j) => (
                                        <td key={j}>{row[col]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">No target data</div>
                )}
            </div>
    );
}

export default PreprocessData;