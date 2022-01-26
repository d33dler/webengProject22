import React, {useState} from "react";
import ArticleService from '../../services/backend.routes'
import DisplayEntry from "./comp.entry_display";
import {statFieldSet} from "../configs/fields_stats";
import {renderField, handleCheckHook, stateful} from "../../func_bin/helper_fun";
import {useParams} from "react-router-dom";
import {checkboxParams} from "../configs/params_field_types";
import {toJSON} from "lodash/seq";


const Statistics = () => {
    const {city} = useParams();
    const [submitted, setSubmit] = useState(false);
    const [data, setData] = useState({});
    const [body, setBody] = useState(stateful(statFieldSet, false));
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
                        {statFieldSet.map((field) => {
                            const {id, type} = field
                            switch (type) {
                                case 'checkbox':
                                    return (renderField(checkboxParams, field,
                                        (event => handleCheckHook(body, setBody, id, event))));
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