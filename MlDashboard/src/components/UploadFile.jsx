import React, { useState } from "react";
import { uploadFile } from "../services/api";
import "./styles/uploadfile.css";

function UploadSection({ onUpload }) {
    const [fileName, setFileName] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            const selectedFile = await uploadFile(file);
            setFileName(file.name);
            onUpload(selectedFile);
        } catch (error) {
            console.error("Upload Error:", error);
        }
    };

    return (
        <div className="upload-control">
            <label>Choose file</label>
            <input
                type="file"
                onChange={handleFileUpload}
                className="file-input"
                accept=".csv,.xlsx,.xls"
                required
            />
            {fileName && (
                <p className="file-name">{fileName}</p>
            )}
        </div>
    );
}

export default UploadSection;
