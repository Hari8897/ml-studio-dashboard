// import Heatmap from "../components/Dataset/Heatmap";
import { useState } from "react";
import "../styles/VisualizationPage.css"
import { use } from "react";


function VisualizationPage({datasetName, columns}) {

    const [activeVisualizationStep, setActiveVisualizationStep] = useState(); // This should be managed by state in a real application
    const [columnName, setColumnName] = useState();
    const [chart, setChart] = useState();
            const VisualizationSteps = [
                { step: 1, title: "Overview", component: <Overview 
                    columns={columns}  
                    datasetName={datasetName} 
                    chart={chart}
                    setChart={setChart}
                    columnName = {columnName}
                    setColumnName ={setColumnName}
                    /> 
                },
                { step: 2, title: "Univariate", component: <Univariate /> },
                { step: 3, title: "Bivariate", component: <Bivariate /> },
                { step: 4, title: "Correlation", component: <Correlation /> },
                { step: 5, title: "Heatmap", component: <Heatmap /> },
                {step: 6, title: "Distribution", component: <Distribution/>}
            ];
    
            const handleClickStep = (step) => {
                // Logic to handle step click, e.g., update state or navigate
                //console.log(`Clicked on step: ${step} ${preprocessingSteps[step - 1]?.title}`);
                setActiveVisualizationStep(step);
    
                }; 
    
            const currentStepData = VisualizationSteps.find(item => item.step === activeVisualizationStep);
    return (
        <div className="workspace-page">
            <div className="workspace-header">
                <div className="workspace-header-content">
                    <h2>Visualization</h2>
                    <p>Prepare your dataset for model training by selecting a target column and applying preprocessing strategies.</p>
                </div>
            </div>
            <section>
                <span>Dataset Name: {datasetName}</span>
            </section>
            <section className="visualization-steps">
                {VisualizationSteps.map((step) => (
                    <button   
                    className = "visualization-step"   
                    key={step.step}
                    onClick={() => handleClickStep(step.step)}
                    >
                        {step.step}.{step.title}
                    </button>
                ))}
            </section>
            <section>
                {currentStepData && (
                    <div className="visualization-step-content">
                        {currentStepData.component}
                        <button className="primary-action" type="button" onClick={() => handleClickStep(activeVisualizationStep + 1)}>
                            Next: {VisualizationSteps[activeVisualizationStep]?.title}
                        </button>
                    </div>

                )}  
            </section>
        </div>

    )
};

export default VisualizationPage;


const Overview= ({datasetName, columns, chart, setChart, columnName, setColumnName})=> {

    const summaryStatistics=[
        {name:"Count", smaplevalue:"10,000"},
        {name:"Mean", smaplevalue:"33.37"},
        {name:"Median", smaplevalue:"29.00"},
        {name:"Standard Deviation", smaplevalue:"24.55"},
        {name:"Minimum", smaplevalue:"0"},
        {name:"Maximum", smaplevalue:"72"},
    ]

    const handleClickChartGenerate  = () => {
        console.log(chart)
        console.log(columnName)
    }

    return (
    <div >
        <div className="visualization-overview-control">
            <div className="visualization-overview-input" >
                <label htmlFor="#">Select Columns</label>
                <select onChange={(e) => setColumnName(e.target.value)} >
                {(!columns || columns.length===0)?(<option value="">Select Column</option>) :(columns.map((col, i) => (
                            <option key={i} value={col}>{col}</option>
                    )))}
                </select>
            </div>
            <div className="visualization-overview-chart" >
                <label htmlFor="#">Chart Type</label>
                <select 
                onChange={(e) => setChart(e.target.value)}>
                    <option>Histrogram</option>
                    <option>Bar Chart</option>
                    <option>line</option>
                </select>
            </div>
            <div className="visualization-overview-button" >
                <button onClick={() => handleClickChartGenerate()}>Generate</button>
            </div>
        </div>
        <div className="container-charts">
            <div className="chart-section">
                {(!columnName)?("column name not found"):(<h3>Distribution of {columnName}</h3>)}
                {chart}

            </div>
            <div className="summary-statistics">
                <table className="summary-statistics-table">
                    <thead>
                        <tr>
                            <th><span>Summary Statistics</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryStatistics.map((column, index) => (
                            <tr key={index}>
                                <td>{column.name}</td>
                                <td>{column.smaplevalue}</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="insight-section">
                display the insights
        </div>
    </div>
)};
    
const Univariate= ()=> {<div>Univariate </div>}
const Bivariate= ()=> {<div>Bivariate</div>}
const Correlation= ()=> {<div>Correlation</div>}
const Heatmap= ()=> {<div>Heatmap</div>}
const Distribution= ()=> {<div>Distribution</div>}