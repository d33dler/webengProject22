import React, {Component, useState} from "react";
import ArticleService from '../services/article.service'
import {Link} from "react-router-dom";
import DisplayEntry from "./comp.display_entry";
import _, {isUndefined} from "lodash";
import {fields_search, fieldMap} from "./fields_search";
import {
    handleChange,
    handleChangeHook,
    handleCheckHook,
    renderField,
    renderRadio, renderRadioHook,
    renderRangeInput,
    stateful
} from "./helper_fun";
import {fieldSet} from "./fields_create";
import {checkboxParams, textFieldParams} from "./params_field_types";

const inputGrSm = "input-group input-group-sm mb-3"


const SearchArticle = () => {

    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [currentIndex, setIndex] = useState(-1);
    const [fieldSet, updateFieldSet] = useState(fields_search);
    const [inputs, setInputs] = useState({});


    function retrieveEntries() {
        refreshList()
        prepareInputs()
        console.log(inputs);
        ArticleService.filterSearch(inputs)
            .then(response => {
                let data;
                if (response.status === 204) {
                    data = null;
                } else {
                    data = response.data;
                }
                setEntries(data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }


    function prepareInputs() {

        Object.entries(inputs).forEach(([key, value]) => {
            console.log(key)
               const field = fieldMap.get(key);
               if(!isUndefined(field) && !isUndefined(field.parent)) {
                   console.log(field);
                   if(!isUndefined(inputs[field.parent])){
                       const v = inputs[key];
                       const arr =  [];
                       arr.push(v);
                       arr.push(inputs[field.parent])
                       inputs[field.parent] = arr;
                   }
                   delete inputs[key]
               }
        })
    }


    function refreshList() {
        setCurrentEntry(null);
        setIndex(-1);
    }

    function setSelection(entry, index) {
        setCurrentEntry(entry);
        setIndex(index);

    }

    function removeEntry() {

    }


    return (<div className="list row">
            <div className="col-md-8">
                {fieldSet.map((field) => {
                    const {
                        name, id, type, options, values
                    } = field;
                    switch (type) {
                        case 'text':
                            return (renderField(textFieldParams, id, name,
                                (e => {
                                    handleChangeHook(inputs, setInputs, id, e)
                                })))
                        case 'range':
                            return renderRangeInput(id, inputs, setInputs, name)
                        case 'checkbox':
                            inputs[id] = false;
                            return (renderField(checkboxParams, id, name,
                                (e => handleCheckHook(inputs, setInputs, id, e))));
                        case 'radio':
                            inputs[id] = values[values.length - 1];
                            return (renderRadioHook(id, inputs, setInputs, values, options, name))
                        default:
                            return null;
                    }
                })}
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={retrieveEntries}>
                        Search
                    </button>
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
                            onClick={() => setSelection(entry, index)}
                            key={index}
                        >
                            {entry.address + ", " + entry.city}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-6">
                {currentEntry && entries ? (
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

export default SearchArticle;
/*

    <button
        className="m-3 btn btn-sm btn-danger"
        onClick={this.removeEntry}
    >
        Remove All
    </button>

*/