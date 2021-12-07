import React, {Component} from "react";
import ArticleService from '../services/article.service'
import {Link} from "react-router-dom";
import DisplayEntry from "./comp.display_entry";

export default class PostArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entries: [],
            currentEntry: null,
            currentIndex: -1,
            id_search: "",
            loc_search: {
                lat: "",
                long: ""
            }
        };
    }

    retrieveEntries = () => {
        const {id_search} = this.state;
        ArticleService.getById(id_search)
            .then(response => {
                this.setState({
                    entries: [response.data]
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    handleChange = (value, event) => {
        this.setState({[`${value}`]: event.target.value});
    }

    refreshList = () => {
        this.retrieveEntries();
        this.setState({
            currentEntry: null,
            currentIndex: -1
        });
    }

    setSelection(entry, index) {
        this.setState({
            currentEntry: entry,
            currentIndex: index
        });
    }

    componentDidMount() {
        this.retrieveEntries();
    }

    removeEntry = () => {

    }

    render() {
        const {id_search, entries, currentEntry, currentIndex} = this.state;
        return (<div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by id"
                            value={id_search}
                            onChange={(event) => this.handleChange('id_search', event)}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.retrieveEntries}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4>Article List</h4>

                    <ul className="list-group">
                        {entries &&
                        entries.map((entry, index) => (
                            <li
                                className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setSelection(entry, index)}
                                key={index}
                            >
                                {entry.address + ", " +entry.city}
                            </li>
                        ))}
                    </ul>


                </div>
                <div className="col-md-6">
                    {currentEntry ? (
                        <div className={"col-md-8"}>
                            <DisplayEntry data={this.state.entries[0]}/>
                        </div>
                    ) : (
                        <div>
                            <br/>
                            <p>No article selected</p>
                        </div>
                    )}
                </div>
            </div>
        )

    }
}

/*

<button
    className="m-3 btn btn-sm btn-danger"
    onClick={this.removeEntry}
>
    Remove All
</button>

 */