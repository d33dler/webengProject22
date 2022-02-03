import React, {useEffect, useState} from "react";
import ArticleService from '../../services/backend.routes'
import DisplayEntry from "./comp.display_entry";
import _, {isNull, isUndefined} from "lodash";
import {fields_search, fieldMap, all_fields} from "../configs/fields_search";
import {creationFields} from "../configs/fields_create";
import structuredClone from "@ungap/structured-clone"
import {
    checkRepresentation, convertDownloadable,
    generateButton, generateDownloadLink, generateForm, listValues, randKey, sendRequest,
} from "../utils/helper_fun";
import {useNavigate, useParams} from "@reach/router";
import {useSearchParams} from 'react-router-dom'
import {metaFields_ALL, formats, meta_default as formatsmeta, meta_default} from "../configs/fields_meta";
import {update} from "lodash/object";


export const defaultState = {
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
    const [meta, setMetaData] = useState(structuredClone(meta_default));
    let navigate = useNavigate();
    let [inputs, setInputs] = useState({});
    let [searchParams, setSearchParams] = useSearchParams();

    function retrieveEntries() {
        sendRequest(ArticleService.filterSearch, updateData,
            () => setStateParam('response', {}), {
                data: parseInputs(),
                meta,
                msg200: null
            })
            .then((r) => {
                handleResponse(r);
            }).catch((err) => console.log(err));
    }

    function handleResponse(res) {
        checkRepresentation(res, setEntries, res.data);
        updateData(res);
    }

    function updateData(res) {
        setStateParam('response', res.data);
        convertDownloadable(res, meta, setStateParam)
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
        sendRequest(ArticleService.filterDelete, updateData,
            () => setStateParam('response', {}),
            {
                data: {externalId: currentEntry.externalId},
                meta,
                msg200: "Delete query accepted rows! Filter properties used\n"
            })
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
        sendRequest(ArticleService.filterUpdate, updateData,
            () => setStateParam('response', {}),
            {
                data: updateQuery,
                meta,
                msg200: "Article patch sent! Filter properties used\n" +
                    JSON.stringify(inputs, null, 2)
            }).then((r) => {
                if (!isNull(r)) {
                    setCurrentEntry(prev => ({...prev, ...soloUpdate}))
                }
            }
        );
    }

    function deleteAllEntries() {
        sendRequest(ArticleService.filterDelete,
            updateData,
            () => setStateParam('response', {}),
            {
                data: parseInputs(),
                meta,
                msg200: 'Delete query sent! Filter properties used\n' +
                    JSON.stringify(inputs, null, 2)
            }).then(() => {
            refreshList();
        }).catch((err) => {
            console.log(err)
        });
    }

    function updateAllEntries() {
        const updateQuery = {
            conditions: parseInputs(),
            fields: bulkUpdate
        }
        sendRequest(ArticleService.filterUpdate, updateData,
            () => setStateParam('response', {}),
            {
                data: updateQuery,
                meta,
                msg200: "Article patch sent! Filter properties used\n" +
                    JSON.stringify(inputs, null, 2)
            }).then(r => {
                window.alert("Server says:\nUpdated " + r.data + " rows! <3")
                refreshList();
        }).catch(err => {console.log(err)});
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
            {generateForm(metaFields_ALL, meta, setMetaData)}
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
                {generateDownloadLink(state.download, 'Download file ' + formats[meta.Accept])}
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
            <ul key = {randKey()} className="list-group">
                {entries.length > 0 &&
                    entries.map((entry, index) =>
                        <li
                            className={"list-group-item " + (index === currentIndex ? "active" : "")}
                            onClick={() => setSelection(entry, index)}
                            key={randKey()}>
                            {listValues(Object.keys(inputs), entry, Object.keys(inputs).length < 2, 2)}
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
