import React, { useState, useRef } from "react";
import { uploadFile } from "../../services/api";
import "../../styles/uploadfile.css";
import { FaCloudUploadAlt } from "react-icons/fa";


function UploadSection({ onUpload }) {
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);    

    const processFile = async (file) => {
        if (!file) return;

        try {
            const selectedFile = await uploadFile(file);
            setFileName(file.name);
            onUpload(selectedFile);
        } catch (error) {
            console.error("Upload Error:", error);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleDragLeave = (e) => {
    e.preventDefault();
    };


    const handleFileSelect = async (e) => {
        processFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        processFile(e.dataTransfer.files[0]);
    }

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    }



    return (
        <>
            <section className="page-title">
                <div>
                    <span><h1>Upload and inspect datasets.</h1></span>
                    <p>Add a dataset, reopen previous uploads, and search through the preview before preprocessing.</p>
                </div>
            </section>
            <section className="upload-panel">
                
                <div className="title">
                    <h3>Upload New Dataset</h3>
                    <p>Upload your CSV, Excel file to get started</p>
                </div>
                <div 
                    className="upload"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                >
                    <span className="upload-icon"><FaCloudUploadAlt/></span>  
                    <h2>Drag and drop your file here</h2>
                    <p>or</p>
                    <button onClick={handleBrowseClick}>Browse Files</button>
                    <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: "none"}}
                    onChange={handleFileSelect}
                    className="file-input"
                    accept=".csv,.xlsx,.xls"
                    required
                />
                {fileName && (<p>Selected:{fileName}</p>)}
                <p>Supported format:CSV, Excel (Max. 100MB)</p>                           
                </div>

            </section>
        </>
        
    );
}

export default UploadSection;
