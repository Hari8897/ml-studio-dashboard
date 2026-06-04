export default function Heatmap({ matrix, columns }) {
    if (!matrix || !columns) return null;

    return (
        <div className="table-container-heatmap">
            <h3>Correlation Heatmap</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th></th>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        )) }
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row, i) => (
                        < tr key={i}>
                            <td>{columns[i]}</td>
                            {row.map((val, j) => (
                                <td
                                    key={j}
                                    style={{
                                        backgroundColor: `rgba(0,0,255, ${Math.abs(val)}`,
                                        color: "white",
                                        
                                    }}>
                                    {val.toFixed(2)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}