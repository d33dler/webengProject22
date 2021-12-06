import React, { Component } from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddEntry from "./components/comp.post_entry";
import Article from "./components/comp.article";
import ArticleList from "./components/comp.entry_list"
import EntryStatistics from "./components/comp.entry_list"

class App extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to="nrp" className="navbar-brand">
                        Netherlands Rental Properties
                   </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"nrp/articles/search/id"} className="nav-link">
                                Search entry
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"nrp/articles/create"} className="nav-link">
                                Add
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"nrp/articles/stats"} className="nav-link">
                                Statistics
                            </Link>
                        </li>
                    </div>
                </nav>

                <div className="container mt-3">
                    <Routes>
                        <Route exact path="nrp" element={App}/>
                        <Route exact path={"nrp/articles/search"} element={<ArticleList/>} />
                        <Route exact path={"nrp/articles/create"} element={<AddEntry/>} />
                        <Route path={"nrp/articles/search/id/:id"} element={<Article/>} />
                        <Route path={"nrp/articles/stats/:city"} element={<EntryStatistics/>} />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default App;