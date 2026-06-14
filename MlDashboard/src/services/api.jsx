import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("API_BASE_URL =", API_BASE_URL)

const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        localStorage.removeItem("user");
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("user");
        return null; 
    }
};


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Full Error:", error);
        console.error("Response:", error.response);
        console.error("Data:", error.response?.data);
        console.error("Status:", error.response?.status); 
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);   
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    };
};


// Common fetch handler
const handleResponse = async (response) => {
    if (!response.ok){
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    return response.json();
}


// Upload file to backend
export const uploadFile = async (file) => {
    if (!file) {
        throw new Error("No file provided for upload.");
    }
    try {


        const user = getStoredUser();
        if (!user?.id) {
            throw new Error(
                "User not logged in."
            )
        }
        console.log("User data for upload:", user);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", user.id);
        formData.append("username", user.username);

        const response = await fetch(
            `${API_BASE_URL}/upload`, 
            {
            method: "POST",
            body: formData,
            }
        );

            return await handleResponse(response);
        }
        catch (error) { 
            console.error("Upload Error:", error);
            throw error;
        }  
}; 

// user specific datasets
// getting userId and metadata
export const getUserDatasets = async (userId) =>{
    const response = await  axios.get(`${API_BASE_URL}/datasets/${userId}`);
    return response.data;
}

// getting dataset with datasetid
export const getDatasetPreview = async (datasetid) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/datasets-preview/${datasetid}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching dataset preview:", error);
        throw error;
    };
};
    


 // select target column
export const fetchSelectTargetData = async (data, target) => {
    const res = await fetch(`${API_BASE_URL}/selectTarget`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, target }),
    });

    return await handleResponse(res);
};

//preprocess data
export const fetchProcessedData = async (features,target, options) => {
    
    try {
        const response = await fetch(`${API_BASE_URL}/preprocess`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ features, target, options })
        });

        
        return await handleResponse(response);

    } catch (error) {
        console.error("Error:", error)
    }
} 

export const getCorrelation = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Correlation data:", file);
    try {
        const response = await fetch(`${API_BASE_URL}/correlation`, {
            method: "POST",
            body: formData,
        });
        return await handleResponse(response);
    } catch (error) {
        console.log("Error:", error)
    }
}


export const trainModel = async(features, target, featureNames, dropColumns) => {

    try {
        const response = await fetch(`${API_BASE_URL}/train`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                features: features,
                target: target,
                featureNames: featureNames,
                dropColumns:dropColumns,
            })
        });

        console.log("Train API Response: ", response.body)
        if (!response.ok) {
  
            throw new Error("Training failed");
        }

        const trainedData = await response.json();
        console.log("trained  Data:", trainedData)
        return trainedData

    } catch (error) {
        console.error("Train API Error:", error);
        return null;
    }
}
