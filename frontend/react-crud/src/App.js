import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
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
                    <a href="components/comp.article.js" className="navbar-brand">
                        Netherlands Rental Properties
                    </a>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/nrp"} className="nav-link">
                                Search entry
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/add"} className="nav-link">
                                Add
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/stats"} className="nav-link">
                                Statistics
                            </Link>
                        </li>
                    </div>
                </nav>

                <div className="container mt-3">
                    <Routes>
                        <Route exact path="/nrp" component={ArticleList} />
                        <Route exact path="/add" component={AddEntry} />
                        <Route path="/nrp/id/:id" component={Article} />
                        <Route path="/nrp/stats/:city" component={EntryStatistics} />
                    </Routes>
                </div>
            </div>
        );
    }
}

export default App;