import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function TrainModel() {
    const [target, setTarget] = useState("");
    const [columns, setColumns] = useState([]);
    const [accuracy, setAccuracy] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/columns");
                console.log("API Response", response);
                setColumns(response.data.columns);
            } catch (error) {
                console.log(error);
            }
        };
        fetchColumns();
        
    }, []);

    const handleTrain = async () => {

        if (!target) {
            alert("Please select or enter target column");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/train",
                {
                    targetColumn: target,
                });
            console.log("API Response", response);
            setAccuracy(response.data.accuracy.score)
        } catch (error) {
            console.log(error);
            alert("Training failed.")
        } finally {
            setLoading(false);
        }
    }


    return (
        <div style={{padding:"10px"} }>
            <select value={target} onChange={(e) => setTarget(e.target.value)} style={{ marginRight: "10px" }}>
                <option value="">Select Target Column</option>
                {columns.map((col, index) => (
                    <option key={index} value={col }>{col}</option>
                )) }
            </select>
            <button onClick={ handleTrain}>Train</button>
            {loading && <p>Training model...</p>}
            {accuracy !== null && <p>Accuracy:{accuracy?(accuracy *100 ).toFixed(2)+"%":"Loading..."}</p> }
        </div>
    )
}





