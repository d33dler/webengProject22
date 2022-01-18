import React, {Component, useEffect, useState} from "react";
import ArticleService from '../services/article.service'
import DisplayEntry from "./comp.display_entry";
import {fieldSet} from "./fields_stats";
import {renderField, renderRadio, newState, handleChange, handleCheckHook, stateful} from "./helper_fun";
import {Link, useParams, useRouteMatch, withRouter} from "react-router-dom";
import {checkboxParams, textFieldParams} from "./params_field_types";
import {toJSON} from "lodash/seq";


const Statistics = () => {
    const {city} = useParams();
    const [submitted, setSubmit] = useState(false);
    const [data, setData] = useState({});
    const [body, setBody] = useState(stateful(fieldSet, false));




    function prepareParams() {
        fieldSet.map((field, ix) => {
            const {id, fun, col} = field
        })
    }

    function retrieveStats() {
        console.log(body)
        ArticleService.getStatistics(city, body)
            .then((response) => {
                    console.log(response.data);
                    setSubmit(true);
                    setData(response.data);
                }
            )

    }

    return (<div className={"submit-form"}>
        <h4 style={{paddingTop: `25px`}}>{city}</h4>
        <div>
            {submitted ?
                (<DisplayEntry data={data}/>)
                : (
                    <div>
                        {fieldSet.map((field) => {
                            const {name, id, type} = field
                            switch (type) {
                                case 'checkbox':
                                    return (renderField(checkboxParams, id, name, (event => handleCheckHook(body, setBody, id, event))));
                                default:
                                    return null;
                            }
                        })}
                        < button
                            style={{marginTop: `25px`}}
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={retrieveStats}
                        >
                            Get statistics
                        </button>
                    </div>)
            }
        </div>
    </div>)
};

export default Statistics;