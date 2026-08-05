import UploadSection from "../components/Dataset/UploadFile";
import { FaArrowRight } from "react-icons/fa";
import Table from "../components/Dataset/Table";



export default function PreprocessingPage({
    onUpload,data,userDatasets,
    openDataset,columns,totalRows,
    filteredRows,searchTerm,setSearchTerm,
    selectedColumn,setSelectedColumn,
    filteredData,selectedDatasetId,
    setSelectedDatasetId}) {
    return (
        <div className="workspace-page">
            <section className="panel one-column">
                <div>
                    <UploadSection onUpload={onUpload} />
                </div>
            </section>
            <div className="field-group">
                <label>Select recent datasets</label>
                <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    required
                >
                    <option value="">Select Dataset</option>
                    {userDatasets.map(dataset => (
                        <option key={dataset.dataset_id} value={dataset.dataset_id}>
                            {dataset.datasetname}
                        </option>
                    ))}
                </select>
            </div>
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
            <section className="recent-panel">
                <table className="recent-dataset-table">
                    <thead>
                        <tr>
                            <th className="panel-title">Recent Datasets</th>
                        </tr>
                        <tr>
                            <th>File Name</th>
                            <th>Rows</th>
                            <th>Columns</th>
                            <th>Uploaded_at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userDatasets.map((dataset)=> (
                            <tr key={dataset.dataset_id}>
                                <td>
                                    <button
                                        className="dataset-link"
                                        onClick={() => 
                                        openDataset(dataset.dataset_id)
                                        }
                                        style={{border:"none", background:"none"}}
                                        >{dataset.datasetname}
                                        </button>
                                </td>
                                <td>{dataset.rows}</td>
                                <td>{dataset.columns}</td>
                                <td>{new Date(dataset.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    padding:"10px"
                }}>
                    <button 
                    style={{
                        border:"none",
                        background:"none",
                        color:"#2563eb",
                        fontSize:"16px",
                        fontWeight:"600",
                        paddingTop:"20px"
                    }}
                    
                    >View All Datasets <FaArrowRight/></button>
                </div>
            </section>
        </div>
    )
}