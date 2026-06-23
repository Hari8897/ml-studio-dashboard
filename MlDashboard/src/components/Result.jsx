import "./styles/result.css";

function Results({ results }) {
    const formatValue = (value) => {
        const numberValue = Number(value);

        if (Number.isFinite(numberValue)) {
            return numberValue.toFixed(3);
        }

        return String(value ?? "-");
    };

    const topPredictions = results?.predictions?.slice(0, 5) || [];
    const actualValues = results?.actual_values || results?.actuals || [];
    const canCompareActuals = topPredictions.length > 0 && actualValues.length > 0;
    const evaluationMetrics = Object.entries(results?.metrics || {});
    const topFeatures = [...(results?.feature_importance || [])]
        .sort((a, b) => Number(b.importance) - Number(a.importance))
        .slice(0, 5);

    if (!results || results.error) {
        return (
            <div className="results-empty">
                <h2>Model results</h2>
                <p>{results?.error || "Train a model to view score, predictions, and feature importance."}</p>
            </div>
        );
    }

    return (
        <div className="results-view">
            <div className="results-header">
                <div>
                    <span className="eyebrow">Model results</span>
                    <h2>{results.model || "Trained model"}</h2>
                    {results.problem_type && <p className="model-type">{results.problem_type}</p>}
                </div>
                <div className="score-card">
                    <span>{results.metric || "Score"}</span>
                    <strong>{formatValue(results.score)}</strong>
                </div>
            </div>

            {evaluationMetrics.length > 0 && (
                <section className="evaluation-panel">
                    <div className="result-block-header">
                        <h3>Evaluation metrics</h3>
                    </div>
                    <div className="metric-cards">
                        {evaluationMetrics.map(([label, value]) => (
                            <div className="metric-card-mini" key={label}>
                                <span>{label}</span>
                                <strong>{formatValue(value)}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="results-grid">
                <section className="result-block">
                    <div className="result-block-header">
                        <h3>{canCompareActuals ? "Prediction vs actual" : "Top 5 predictions"}</h3>
                    </div>

                    {topPredictions.length > 0 ? (
                        <div className="prediction-table">
                            <div className={`prediction-row prediction-head ${canCompareActuals ? "" : "prediction-only"}`}>
                                <span>#</span>
                                <span>Prediction</span>
                                {canCompareActuals && <span>Actual</span>}
                            </div>
                            {topPredictions.map((value, index) => (
                                <div
                                    className={`prediction-row ${canCompareActuals ? "" : "prediction-only"}`}
                                    key={`${value}-${index}`}
                                >
                                    <span>{index + 1}</span>
                                    <strong>{formatValue(value)}</strong>
                                    {canCompareActuals && <span>{formatValue(actualValues[index])}</span>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="muted">No predictions returned.</p>
                    )}
                </section>

                <section className="result-block">
                    <div className="result-block-header">
                        <h3>Important features</h3>
                    </div>

                    {topFeatures.length > 0 ? (
                        <ul className="features">
                            {topFeatures.map((item, index) => {
                                const importance = Math.max(0, Number(item.importance) || 0);
                                const maxImportance = Math.max(
                                    ...topFeatures.map((feature) => Number(feature.importance) || 0),
                                    1
                                );
                                const width = `${Math.max(8, (importance / maxImportance) * 100)}%`;

                                return (
                                    <li key={`${item.feature}-${index}`}>
                                        <div className="feature-line">
                                            <span>{item.feature}</span>
                                            <strong>{formatValue(item.importance)}</strong>
                                        </div>
                                        <div className="feature-bar">
                                            <span style={{ width }} />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="muted">Feature importance is not available for this model.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Results;
