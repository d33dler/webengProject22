import React, {Component, useEffect, useState} from "react";
import ArticleService from '../services/article.service'
import DisplayEntry from "./comp.display_entry";
import {fieldSet} from "./fields_stats";
import {renderField, renderRadio, newState, handleChange, newStateful} from "./helper_fun";
import {Link, useParams, useRouteMatch, withRouter} from "react-router-dom";
import {checkboxParams, textFieldParams} from "./params_field_types";
import {toJSON} from "lodash/seq";


const Statistics = () => {
    const {city} = useParams();
    const [submitted, setSubmit] = useState(false);
    const [data, setData] = useState({});
    const body = stateful(fieldSet, false);


    function handleCheck(value, e) {
        body[`${value}`] = e.target.checked;
        console.log(body[`${value}`])
    }

    function stateful(fieldSet, defaultVal){
        let state = {submitted: false};
        for (let i = 0; i < fieldSet.length; i++) {
            state[`${fieldSet[i].id}`] = defaultVal;
        }
        return state;
    }
    function prepareParams() {
        fieldSet.map((field,ix) => {
            const {id, fun, col} = field
        })
    }

    function retrieveStats() {
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
                            const {[id]: stateField} = {body};
                            switch (type) {
                                case 'checkbox':
                                    return (renderField(this, checkboxParams, stateField, id, name,
                                        (event => handleCheck(id, event))));
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