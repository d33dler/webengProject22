import React, {Component, useEffect, useState} from "react";
import ArticleService from '../../services/backend.routes'
import DisplayEntry from "./comp.display_entry";
import {fieldSet} from "../configs/fields_stats";
import {
    renderField,
    handleCheckHook,
    stateful,
    checkRepresentation,
    convertDownloadable,
    generateForm, generateDownloadLink
} from "../utils/helper_fun";
import {useParams} from "react-router-dom";
import {checkboxParams} from "../configs/params_field_types";
import {metaFields_ALL, meta_default, metaFields_IO} from "../configs/fields_meta";
import structuredClone from "@ungap/structured-clone";
import {defaultState} from "./comp.search_entries";


const Statistics = () => {
    const {city} = useParams();
    const [submitted, setSubmit] = useState(false);
    const [data, setData] = useState({});
    const [body, setBody] = useState(stateful(fieldSet, false));
    const [meta, setMetaData] = useState(structuredClone(meta_default));
    const [state, setState] = useState(structuredClone(defaultState))

    function retrieveStats() {
        console.log(body);
        ArticleService.getStatistics(city, body, meta)
            .then((res) => {
                    console.log(res.data);
                    setSubmit(true);
                    handleResponse(res);
                }
            ).catch(err => {
                window.alert(err);
            }
        )
    }

    function handleResponse(res) {
        checkRepresentation(res, setData, res.data);
        convertDownloadable(res, meta, setStateParam);
    }

    function download() {
        return generateDownloadLink(state.download, 'Download statistic')
    }

    function setStateParam(param, value) {
        setState(prevState => ({
            ...prevState,
            [param]: value
        }))
    }

    return <div className={"submit-form"}>
        <h4 style={{paddingTop: `25px`}}>{city}</h4>
        <div>
            {submitted ?
                (Object.entries(data).length !== 0 ?
                    <div>
                        <DisplayEntry data={data}>
                        </DisplayEntry> {download()}
                    </div> :
                    <div>
                        <h2> UI representation not available.
                            You may download the query result</h2>
                        {download()}
                    </div>) : <div>
                    {fieldSet.map((field) => {
                        const {id, type} = field
                        switch (type) {
                            case 'checkbox':
                                return (renderField(field, checkboxParams, (event => handleCheckHook(body, setBody, id, event))));
                            default:
                                return null;
                        }
                    })}
                    {generateForm(metaFields_IO, meta, setMetaData)}
                    < button
                        style={{marginTop: `25px`}}
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={retrieveStats}
                    >
                        Get statistics
                    </button>
                </div>
            }
        </div>
    </div>
};

export default Statistics;