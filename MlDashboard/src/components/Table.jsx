import './styles/table.css';


export default function Table({ columns, data, filteredData }) {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>   
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col, i) => (
                                    <td key={i}>{row[col]}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                No Data Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};