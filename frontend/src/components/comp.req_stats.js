import React, {Component} from "react";
import {fieldSet} from "./fields_stats";
import {newState, renderField, handleCheck, createLabel, handleChange} from "./helper_fun";
import {Link, useHistory, useLocation} from "react-router-dom";
import {checkboxParams, textFieldParams} from "./params_field_types";
import ArticleService from "../services/article.service";


export default class StatisticForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...newState(fieldSet),
            submitted: false,
            entries: [],
            city: '',
            currentEntry: null,
            currentIndex: -1,
        };

    }
    refreshList = () => {
        this.setState({
            currentEntry: null,
            currentIndex: -1
        });
    }
    retrieveEntries = () => {
        this.refreshList()
        const {city} = this.state;
        ArticleService.getByParam('city', city)
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

    setSelection = (entry, index) => {
        this.setState({
            currentEntry: entry,
            currentIndex: index
        });
    }

    render() {
        const {entries, currentEntry, currentIndex} = this.state;
        return (
            <div className={"submit-form"}>
                {fieldSet.map((field) => {
                    const {name, id, type} = field;
                    const {[id]: stateField} = this.state;
                    switch (type) {
                        case 'text':
                            return (renderField(this, textFieldParams, stateField, id, name,
                                (event => handleChange(this, id, event))));
                        default:
                            return null;
                    }
                })}
                <button
                    style={{marginTop: `25px`}}
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.retrieveEntries}>
                    Search
                </button>
                <div className="col-md-6">
                    <h4 style={{paddingTop: `25px`}}>Article List</h4>

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
                                {index + ". " + entry.city}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={"position-absolute top-75 start-75"}>
                    {currentEntry && this.state.entries ? (
                        <div>
                            {createLabel(`${currentEntry.city}`)}
                            <Link to={"/nrp/articles/stats/" + currentEntry.city} className="badge badge-warning">
                                <button type={"button"}>
                                    Get statistics
                                </button>
                            </Link>
                        </div>
                    ) : (<div>
                        <br/>
                        <p>Please select a city</p>
                    </div>)}
                </div>
            </div>
        );
    }
}