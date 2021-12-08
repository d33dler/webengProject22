import React, {Component} from "react";
import ArticleService from '../services/article.service'
import {Link} from "react-router-dom";
import DisplayEntry from "./comp.display_entry";
const inputGrSm = "input-group input-group-sm mb-3"
export default class SearchArticle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entries: [],
            currentEntry: null,
            currentIndex: -1,
            id_search: "",
            rent: {min: 0, max: 0},
            sqm: {min: 0, max: 0},
            loc_search: {lat: "", long: ""}
        };
    }

    retrieveEntries = () => {
        this.refreshList()
        const {id_search} = this.state;
        ArticleService.getById(id_search)
            .then(response => {
                let data;
                if (response.status === 204) {
                    data = null;
                } else data = response.data;

                this.setState({
                    entries: data
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
        this.setState({
            currentEntry: null,
            currentIndex: -1
        });
    }

    setSelection = (entry, index) => {
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


    renderInput = (clazz, value, ph) => {
        return (<input
            type="text"
            className="form-control"
            placeholder={ph}
            value={this.state[`${value}`]}
            onChange={(event) => this.handleChange(value, event)}
        />)
    }
    renderRangeInput = (value, label) => {
        return (
            <section class="mb-lg-2">
                <label htmlFor="to">{label} </label>
                <div className="d-flex align-items-center mt-sm-1 pb-1">
                    <div className="md-form md-outline my-0">
                        {this.renderInput("form-control sm-0",value+".min",'min')}
                    </div>
                    <p className="px-1 mb-lg-2 text-muted"> - </p>
                    <div className="md-form md-outline my-0">
                        {this.renderInput("form-control sm-0",value+".max",'max')}

                    </div>
                </div>
            </section>
        )
    }


    render() {

        const {entries, currentEntry, currentIndex} = this.state;
        return (<div className="list row">
                <div className="col-md-8">
                    <div className={inputGrSm}>
                        {this.renderInput("form-control", 'id_search', "ID")}
                    </div>
                    <label style={{marginRight: '20px'}} >Location: </label>
                    <div className={inputGrSm}>
                        {this.renderInput("form-control", 'loc_search.lat', "lat")}
                        {this.renderInput("form-control", 'loc_search.long', "long")}
                    </div>
                    <div className={inputGrSm}>
                        {this.renderRangeInput("rent", "Rent:")}
                    </div>
                    <div className={inputGrSm}>
                        {this.renderRangeInput("sqm", "Square Area (meters):")}
                    </div>
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={this.retrieveEntries}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4>Article List</h4>
                    <ul className="list-group">
                        {entries.length>0 &&
                        entries.map((entry, index) => (
                            <li
                                className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setSelection(entry, index)}
                                key={index}
                            >
                                {entry.address + ", " + entry.city}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    {currentEntry && this.state.entries ? (
                        <div className={"col-md-8"}>
                            <DisplayEntry data={currentEntry}/>
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