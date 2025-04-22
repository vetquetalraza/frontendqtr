import '../styles/global.scss';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";

const Layout = () => {
    return(
        <>
        <Header />
        <div className="main-container">
            <Sidebar />
            <div className="second-container">
                <div className="form-container">
                <Outlet /> 
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default Layout;

