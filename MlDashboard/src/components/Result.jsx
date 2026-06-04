import "./styles/result.css";

function Results({ results }) {

    if (!results) {
        return <p>No results yet</p>;
    }

    return (
        <>
            <h2>Model Results</h2>

            {/* Model Info */}
            <p><strong>Model:</strong> {results.model}</p>
            <p><strong>{results.metric} Score:</strong> {results.score}</p>

            {/* Predictions (optional preview) */}
            <h3>Predictions (First 5)</h3>
            <ul className="prediction">
                {results.predictions?.slice(0, 10).map((val, index) => (
                    <li key={index}>{val.toFixed(3)}</li>
                ))}
            </ul>

            {/* Feature Importance */}
            <h3>Feature Importance</h3>
            <ul className="features">
                {results.feature_importance?.map((item, index) => (
                    <li key={index}>
                        {item.feature}: {Number(item.importance).toFixed(3)}
                    </li>
                ))}
            </ul>            
        </>
    );
}

export default Results;