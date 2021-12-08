import React, {Component, useState} from "react";
import ArticleService from '../services/article.service'
import DisplayEntry from "./comp.display_entry";
import {fieldSet} from "./fields_stats";
import {renderField, renderRadio, newState, handleCheck, handleChange, newStateful} from "./helper_fun";
import {Link, useParams, useRouteMatch, withRouter} from "react-router-dom";
import {checkboxParams, textFieldParams} from "./params_field_types";



const Statistics = () => {
    const {city} = useParams();
    const [submitted, setSubmit] = useState(false);
    const [data, setData] = useState({});
    const body = {
        ...newState(fieldSet)
    }

    function handleCheck(comp, value, event) {
        body[`${value}`] = event.target.checked;
    }

    function retrieveStats() {
        ArticleService.getStatistics(city, body)
            .then((response) => {
                    console.log(response.data);
                    setSubmit(true) ;
                    setData(response.data);
                }
            )
    }

    return (<div className={"submit-form"}>
        <h4 style={{paddingTop: `25px`}}>{city}</h4>
        {fieldSet.map((field) => {
            const {name, id, type} = field
            const {[id]: stateField} = {body};
            switch (type) {
                case 'checkbox':
                    return (renderField(this, checkboxParams, stateField, id, name,
                        (event => handleCheck(this, id, event))));
                default:
                    return null;
            }
        })}
        <button
            style={{marginTop: `25px`}}
            className="btn btn-outline-secondary"
            type="button"
            onClick={retrieveStats}
        >
            Get statistics
        </button>
        <div>
            {submitted ?
                (<DisplayEntry data={data}/>) : null
            }
        </div>
    </div>)
};

export default Statistics;