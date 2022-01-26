import React, {useEffect, useState} from "react";
import ArticleService from '../../services/backend.routes'
import DisplayEntry from "./comp.entry_display";
import {isNull, isUndefined} from "lodash";
import {fields_search, fieldMap, all_fields} from "../configs/fields_search";
import {creationFields} from "../configs/fields_create";
import structuredClone from "@ungap/structured-clone"
import {
    generateButton, generateForm,
} from "../../func_bin/helper_fun";

import {useNavigate} from "@reach/router";
import {useSearchParams} from 'react-router-dom'
import {fields_meta, formats, meta_state} from "../configs/fields_meta";
import {toJSON} from "lodash/seq";
import {csvToJSON} from "../utils/helper_utils";
import csvtojsonV2 from "csvtojson/v2";
import RawOverview from "./comp.raw_look";

let appJson = 'application/json'
const defaultState = {
    update: false,
    queryUpdate: false,
    singleUpdate: false,
    customFormat: false,
}

const SearchArticle = () => {
    const [state, setState] = useState(defaultState);
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [currentIndex, setIndex] = useState(-1);
    const [fieldSet, updateFieldSet] = useState(fields_search);
    const [bulkUpdate, setBulkUpdate] = useState({});
    const [soloUpdate, setSoloUpdate] = useState({});
    const [response, setResponse] = useState({});
    let [searchParams, setSearchParams] = useSearchParams();
    let [inputs, setInputs] = useState({});
    let navigate = useNavigate();
    let [meta, setMetaData] = useState(meta_state);


    function retrieveEntries() {
        sendRequest(ArticleService.filterSearch,
            parseInputs(),
            null, "500 Internal server error").then((r) => {
            if (!isNull(r)) updateEntries(r);
        });
    }


    function updateEntries(response) {
        console.log(response.headers);
        if (response.headers['content-type'].includes('application/json')) {
            setEntries(response.data);
        } else {
            setState({...state, customFormat: true})
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
            "The selected query was deleted successfully!\n", "0 entries deleted")
            .then(() => {
                setEntries([]);
                refreshList();
            })
    }

    function getSoloUpdateForm() {
        setEntries([currentEntry]);
        appendNewValue("singleUpdate", true);
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
        return await _request(parsed, meta).then(response => {
            if (response.status === 500) {
                throwAlert(msg500)
                setResponse(null);
                return null;
            } else {
                throwAlert(msg200);
                setResponse(response.data);
                return response;
            }
        }).catch(e => {
            console.log(e);
        });
    }

    function throwAlert(msg) {
        isNull(msg) ? msg = false : window.alert(msg);
    }

    function resetState() {
        setEntries([]);
        setState(prevState => ({
            ...prevState,
            update: false,
        }))
    }

    function appendNewValue(param, value) {
        setState(prevState => ({
            ...prevState,
            [param]: value
        }))
    }

    function downloadRawQuery() {

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
                    appendNewValue('update', true)
                })}
                {generateButton("Delete all", deleteAllEntries)}
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
                        {entry.address + ", " + entry.city}
                    </li>)}
            </ul>

        </div>
        <div className="col-md-6">
            {state.customFormat ?
               <a href= {URL.createObjectURL(new Blob([response.toString()], {type: meta.Accept}))} download>Click to download</a>
                 :
                (currentEntry && entries ? <div className={"col-md-8"}>
                <DisplayEntry data={currentEntry}/>
                    {generateButton("Delete",  deleteSelectedEntry)}
                    { generateButton("Update",  getSoloUpdateForm)}
                <div>
                    {state.singleUpdate ?
                        <div>{generateForm(creationFields, soloUpdate, setSoloUpdate)}
                            {generateButton("PATCH", updateSelectedEntry)}</div> : null}
                </div>
            </div> : <div>
                <br/>
                <p>No article selected</p>
            </div>)}
        </div>
    </div>
}

export default SearchArticle;