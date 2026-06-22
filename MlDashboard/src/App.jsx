import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import AuthPage from "./pages/AuthPage"
import Navbar from "./layouts/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() { 
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/auth" element={<AuthPage />}/>
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/reset-password" element={<ResetPassword/> }/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/upload" element={<Dashboard/>}/>
                <Route path="/preprocess" element={<Dashboard/>}/>
                <Route path="/visualize" element={<Dashboard/>}/>
                <Route path="/model" element={<Dashboard/>}/>
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        </BrowserRouter>
       
    );
}

export default App;
