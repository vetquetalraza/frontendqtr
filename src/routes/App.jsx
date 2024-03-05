import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '../containers/Layout';
import Appointment from '../containers/Appointment';
import Care from '../containers/Care';
import Client from '../containers/Client';
import History from '../containers/History';
import Home from '../containers/Home';
import Inventory from '../containers/Inventory';
import Login from '../containers/Login';
import Pet from '../containers/Pet';
import Report from '../containers/Reports';
import '../styles/global.css';

const App = () => {

    return(
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route exact path="/appointment" element={<Appointment/>}/>
                        <Route exact path="/care" element={<Care/>}/>
                        <Route exact path="/clients" element={<Client/>}/>
                        <Route exact path="/history" element={<History/>}/>
                        <Route exact path="/home" element={<Home/>}/>
                        <Route exact path="/inventory" element={<Inventory/>}/>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route exact path="/pets" element={<Pet/>}/>
                        <Route exact path="/reports" element={<Report/>}/>
                        <Route path="*" element={<Home/>}/> 
                    </Routes>        
                </Layout>
            </BrowserRouter>
    );
}

export default App;

