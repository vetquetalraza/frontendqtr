import '../styles/global.scss';
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Layout = ({children}) => {
    return(
        <>
        <Header />
        <div className="main-container">
            <Sidebar />
            <div className="second-container">
                <div className="form-container">
                    {children}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default Layout;

