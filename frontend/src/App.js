import React, { Component } from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddEntry from "./components/views/comp.post_entry";
import ArticleList from "./components/views/comp.search_entries"
import SelectCity from "./components/views/comp.req_stats"
import Statistics from "./components/views/comp.stats"
import {createHistory, LocationProvider} from "@reach/router";
//Main App

let history = createHistory(window)

const App = () => {
        return (
            <LocationProvider history={history}>
                <div>
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <Link to="nrp" className="navbar-brand">
                            Netherlands Rental Properties
                        </Link>
                        <div className="navbar-nav mr-auto">
                            <li key='search' className="nav-item">
                                <Link to={"nrp/articles/search?limit=5"} className="nav-link">
                                    Search
                                </Link>
                            </li>
                            <li key="create" className="nav-item">
                                <Link to={"nrp/articles/create"} className="nav-link">
                                    Add
                                </Link>
                            </li>
                            <li key="stats" className="nav-item">
                                <Link to={"nrp/articles/stats"} className="nav-link">
                                    Statistics
                                </Link>
                            </li>
                        </div>
                    </nav>

                    <div className="container mt-3">
                        <Routes>
                            <Route exact path="nrp" element={App}/>
                            <Route path={"nrp/articles/stats/raw/:file"}  element={<SelectCity/>} />
                            <Route path={"nrp/articles/search/"} element={<ArticleList/>} />
                            <Route path={"nrp/articles/create"} element={<AddEntry/>} />
                            <Route path={"nrp/articles/stats/:city"} element={<Statistics />} />
                            <Route path={"nrp/articles/stats"} element={<SelectCity/>} />
                        </Routes>
                    </div>
                </div>
            </LocationProvider>
        );
}

export default App;
