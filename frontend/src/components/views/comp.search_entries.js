import React, {useEffect, useState} from "react";
import ArticleService from '../../services/backend.routes'
import DisplayEntry from "./comp.display_entry";
import _, {isNull, isUndefined} from "lodash";
import {fields_search, fieldMap, all_fields} from "../configs/fields_search";
import {creationFields} from "../configs/fields_create";
import structuredClone from "@ungap/structured-clone"
import {
    generateButton, generateForm,
} from "../utils/helper_fun";
import {useNavigate, useParams} from "@reach/router";
import {useSearchParams} from 'react-router-dom'
import {fields_meta, formats, meta_default as formatsmeta, meta_default} from "../configs/fields_meta";


const defaultState = {
    update: false,
    response: {},
    searched: false,
    queryUpdate: false,
    singleUpdate: false,
    customFormat: true,
    download: null
}

const SearchArticle = (props) => {
    const [state, setState] = useState(defaultState);
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [currentIndex, setIndex] = useState(-1);
    const [fieldSet, updateFieldSet] = useState(fields_search);
    const [bulkUpdate, setBulkUpdate] = useState({});
    const [soloUpdate, setSoloUpdate] = useState({});
    const [meta, setMetaData] = useState(meta_default);
    let navigate = useNavigate();
    let [inputs, setInputs] = useState({});
    let [searchParams, setSearchParams] = useSearchParams();

    function retrieveEntries() {
        sendRequest(ArticleService.filterSearch, parseInputs(),
            "Searching completed", "Server error occurred")
            .then((r) => {
                if (!isNull(r)) updateEntries(r);
            });
    }

    function updateEntries(res) {
        if (res.headers['content-type'].includes('application/json')) {
            setEntries(res.data);
        }
        updateData(res);
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
    }, [])

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
        setEntries([]);
        setCurrentEntry(null);
        setIndex(-1);
    }

    function setSelection(entry, index) {
        setCurrentEntry(entry);
        setIndex(index);
    }

    function deleteSelectedEntry() {
        sendRequest(ArticleService.filterDelete, {externalId: currentEntry.externalId},
            "Delete query accepted rows! Filter properties used\n", "0 entries deleted")
            .then(() => {
                setEntries([]);
                refreshList();
            })
    }

    function getSoloUpdateForm() {
        setEntries([currentEntry]);
        setStateParam("singleUpdate", true);
    }

    function updateSelectedEntry() {
        const updateQuery = {
            conditions: {externalId: currentEntry.externalId},
            fields: soloUpdate
        }
        sendRequest(ArticleService.filterUpdate,
            updateQuery,
            "Article patch sent! Filter properties used\n" +
            JSON.stringify(inputs, null, 2), "500 Internal server error").then((r) => {
                if (!isNull(r)) {
                    setCurrentEntry(prev => ({...prev, ...soloUpdate}))
                }
            }
        );
    }

    function deleteAllEntries() {
        const parsed = parseInputs()
        sendRequest(ArticleService.filterDelete, parsed,
            "Delete query sent! Filter properties used\n" +
            JSON.stringify(inputs, null, 2), "500 Internal server error").then(() => {
            refreshList();
        });
    }

    function updateAllEntries() {

        const parsed = parseInputs()
        const updateQuery = {
            conditions: parsed,
            fields: bulkUpdate
        }
        sendRequest(ArticleService.filterUpdate, updateQuery,
            "Article patch sent! Filter properties used\n" +
            JSON.stringify(inputs, null, 2),
            "500 Internal server error").then(r => {
            if (!isUndefined(r)) {
                window.alert("Server says:\nUpdated " + r.data + " rows! <3")
                refreshList();
            }
        });

    }

    async function sendRequest(_request, parsed, msg200, msg500,) {
        return await _request(parsed, meta)
            .then(response => {
                if (response.status === 500) {
                    window.alert(msg500);
                    setStateParam('response', {});
                    return null;
                } else {
                    window.alert(msg200);
                    updateData(response);
                    return response;
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    function updateData(res) {
        let objArr;
        setStateParam('response', res.data);
        if (res.headers['content-type'].includes('application/json')) {
            objArr = JSON.stringify(res.data);
        } else {
            objArr = res.data.toString();
        }
        setStateParam('download',
            URL.createObjectURL(new Blob([objArr],
                {type: meta.Accept})));
    }

    function resetState() {
        setEntries([]);
        setState(prevState => ({
            ...prevState,
            update: false,
            searched: false
        }))
    }

    function setStateParam(param, value) {
        setState(prevState => ({
            ...prevState,
            [param]: value
        }))
    }

    return <div className="list row">
        <div className="col-md-8">
            {generateForm(fields_meta, meta, setMetaData)}
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
                    setStateParam('update', true)
                })}
                {generateButton("Delete all", deleteAllEntries)}
                {
                    <a href={state.download} download>Click to download</a>
                }
                {state.update ? <form className="col-md-8">
                    {generateForm(creationFields, bulkUpdate, setBulkUpdate)}
                    {generateButton("Update", () => {
                        updateAllEntries();
                        _selfTriggerRedirect();
                    })}
                </form> : null}
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
                        {entry.title + ", " + entry.city}
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
                            {generateButton("PATCH", updateSelectedEntry)}</div> : null}
                </div>
            </div> : <div>
                <br/>
                <p>No article selected</p>
            </div>}
        </div>
    </div>
}

export default SearchArticle;
