import React, { useState } from "react";
import { uploadFile } from "../services/api";
//import "./styles/uploadfile.css"

function UploadSection({ onUpload }) {
    const [fileName, setFileName] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
       // console.log("Uploaded file:", file)

        
        if (!file) return ;

        try {
            const selectedFile = await uploadFile(file);
            console.log("Selected file:", selectedFile);
            //console.log("Response from backend:", data);
            // send file to parent
            setFileName(selectedFile?.name || "");
            onUpload(selectedFile); 
        } catch (error) {
            console.error("Upload Error:", error)
        }        
    };

    return (
        <div className="upload-section">

            <label><b>Upload File</b></label>

            <input
                type="file"
                onChange={handleFileUpload}
                className="file-input"
            />

            {fileName && (
                <p className="file-name">📁 {fileName}</p>
            )}

        </div>
    );
}

export default UploadSection;