import '../styles/global.scss';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";
import { useState } from 'react';

const Layout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <>
        <div className="app-layout">
            <Header toggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <div className="main-container">
                {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
                <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />
                <div className="second-container">
                    <div className="form-container">
                    <Outlet /> 
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        </>
    );
}

export default Layout;

