import React, {Component, createContext, useContext, useEffect, useState} from "react";
import ArticleService from '../services/backend.routes'
import DisplayEntry from "./comp.display_entry";
import _, {isNull, isUndefined} from "lodash";
import {fields_search, fieldMap, all_fields} from "./fields_search";
import {creationFields} from "./fields_create";
import structuredClone from "@ungap/structured-clone"
import {
    generateButton, generateDialogue,
    generateForm,
} from "./helper_fun";

import {checkboxParams, textFieldParams} from "./params_field_types";
import {useNavigate, useParams} from "@reach/router";
import {useSearchParams} from 'react-router-dom'

const inputGrSm = "input-group input-group-sm mb-3"

const defaultState = {
    update: false,
    searched: false,
    queryUpdate: false,
    singleUpdate: false,
}

const SearchArticle = (props) => {
    const [state, setState] = useState(defaultState);
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [currentIndex, setIndex] = useState(-1);
    const [fieldSet, updateFieldSet] = useState(fields_search);
    let [inputs, setInputs] = useState({});
    const [bulkUpdate, setBulkUpdate] = useState({});
    const [soloUpdate, setSoloUpdate] = useState({});
    let navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    function retrieveEntries() {
        if (state.searched === false) {
            refreshList()
            const parsed = parseInputs()
            console.log(parsed);
            ArticleService.filterSearch(parsed)
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
            resetStateParam("searched", true)
        }

    }

    useEffect(() => {
        all_fields.forEach((obj) => {
            const param = searchParams.get(`${obj.id}`);
            if (!isNull(param)) {
                if (isUndefined(inputs[`${obj.id}`])) {
                    inputs[`${obj.id}`] = param;
                }
            }
        });
        setInputs(inputs);
        retrieveEntries();
    })

    function _selfTriggerRedirect() {
        const p = new URLSearchParams();
        Object.entries(inputs).forEach(([key, value]) => {
            p.append(`${key}`, `${value}`);
        })
        setSearchParams(inputs);
        navigate("/../nrp/articles/search?" + p, {replace: true});
    }

    function parseInputs() {
        const inputsCopy = structuredClone(inputs)
        Object.entries(inputsCopy).forEach(([key, value]) => {
            const field = fieldMap.get(key);
            if (!isUndefined(field) && !isUndefined(field.parent)) {
                if (!isUndefined(inputsCopy[field.parent])) {
                    const v = inputsCopy[key];
                    const arr = [];
                    arr.push(v);
                    arr.push(inputsCopy[field.parent])
                    inputsCopy[field.parent] = arr;
                }
                delete inputsCopy[key]
            }
        })
        return inputsCopy;
    }


    function refreshList() {
        setCurrentEntry(null);
        setIndex(-1);
    }

    function setSelection(entry, index) {
        setCurrentEntry(entry);
        setIndex(index);
    }

    function deleteSelectedEntry() {
        refreshList();
        ArticleService.filterDelete({externalId: currentEntry.externalId})
            .then(response => {
                let data;
                if (response.status === 500) {
                    window.alert("0 entries deleted");
                } else {
                    data = response.data;
                    window.alert("Delete query accepted rows! Filter properties used\n" +
                        JSON.stringify(inputs, null, 2));
                }
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function getSoloUpdateForm() {
        setEntries([currentEntry])
        resetStateParam("singleUpdate", true);
    }

    function updateSelectedEntry() {
        refreshList();
        const updateQuery = {
            conditions: {externalId: currentEntry.externalId},
            fields: soloUpdate
        }
        sendRequest(ArticleService.filterUpdate,
            updateQuery,
            "Article patch sent! Filter properties used\n" +
            JSON.stringify(inputs, null, 2), "500 Internal server error");
    }

    function deleteAllEntries() {
        refreshList();
        const parsed = parseInputs()
        sendRequest(ArticleService.filterDelete,
            "Delete query sent! Filter properties used\n" +
            JSON.stringify(inputs, null, 2), "500 Internal server error");
    }

    function updateAllEntries() {
        refreshList()
        const parsed = parseInputs()
        const updateQuery = {
            conditions: parsed,
            fields: bulkUpdate
        }
        const res = sendRequest(ArticleService.filterUpdate, updateQuery,
            "Article patch sent! Filter properties used\n" +
            JSON.stringify(inputs, null, 2),
            "500 Internal server error" );
        if(!isNull(res)) {
            window.alert("Server says:\nUpdated " + res.data + " rows! <3")
        }
    }

    function sendRequest(_request,parsed, msg200, msg500,) {
       return _request(parsed)
            .then(response => {
                if (response.status === 500) {
                    window.alert(msg500);
                } else {
                    window.alert(msg200);
                }
                return response;
            })
            .catch(e => {
                console.log(e);
            });
    }

    function resetState() {
        setEntries([]);
        setState(prevState => ({
            ...prevState,
            update: false,
            searched: false
        }))
    }

    function resetStateParam(param, value) {
        setState(prevState => ({
            ...prevState,
            [param]: value
        }))
    }

    return <div className="list row">
        <div className="col-md-8">
            {generateForm(fieldSet, inputs, setInputs, searchParams)}
            <div className="input-group-append">
                {generateButton("Search", () => {
                    resetState();
                    retrieveEntries();
                    _selfTriggerRedirect();
                })}
                {generateButton("Update all", () => {
                    refreshList();
                    setEntries([]);
                    resetStateParam('update', true)
                })}
                {generateButton("Delete all", deleteAllEntries)}
                {state.update ? <form className="col-md-8">
                    {generateForm(creationFields, bulkUpdate, setBulkUpdate)}
                    {generateButton("Update", updateAllEntries)}
                </form> : null}
                {state.queryUpdate ? <div> {generateDialogue("TEST")} </div> : null}
            </div>
        </div>
        <div className="col-md-6">
            <h4>Article List</h4>
            <ul className="list-group">
                {entries.length > 0 &&
                entries.map((entry, index) =>
                    <li
                        className={"list-group-item " + (index === currentIndex ? "active" : "")}
                        onClick={() => setSelection(entry, index)}
                        key={index}>
                        {entry.address + ", " + entry.city}
                    </li>)}
            </ul>

        </div>
        <div className="col-md-6">
            {currentEntry && entries ? <div className={"col-md-8"}>
                <DisplayEntry data={currentEntry}/>
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={deleteSelectedEntry}>
                    Delete
                </button>
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={getSoloUpdateForm}>
                    Update
                </button>
                <div>
                    {state.singleUpdate ?
                        <div>{generateForm(creationFields, soloUpdate, setSoloUpdate)}
                            {generateButton("PATCH",updateSelectedEntry)}</div>: null}
                </div>
            </div> : <div>
                <br/>
                <p>No article selected</p>
            </div>}
        </div>
    </div>
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