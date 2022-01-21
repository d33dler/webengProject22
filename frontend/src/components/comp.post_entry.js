import React, {Component, useState} from 'react';
import ArticleService from '../services/backend.routes';
import {creationFields} from './fields_create';
import DisplayEntry from "./comp.display_entry";
import {renderField, renderRadio, newState, handleChange, generateForm, generateButton} from "./helper_fun";

const PostArticle = () => {

    const [fieldSet, updateFieldSet] = useState(creationFields);
    const [inputs, setInputs] = useState({});
    const [state, setState] = useState({submitted: false, data: null});

    function uploadArticle() {
        ArticleService.create(inputs)
            .then((response) => {
                console.log(response.data);
                setState({submitted: true, data: response.data});
            }).catch((el) => {
            console.log(el);
        });
    }


    function refresh() {
        setState({submitted: false, data: null});
        setInputs({});
    }

    return (
        <div className="submit-form">
            {state.submitted ? (
                <div>
                    <h5>Article was uploaded into the database!</h5>
                    <DisplayEntry data={state.data}/>
                    <button
                        className="btn btn-success"
                        onClick={refresh}>
                        Continue
                    </button>
                </div>
            ) : (
                <form>
                    {generateForm(fieldSet, inputs, setInputs)}
                    {generateButton("Submit", uploadArticle)}
                </form>)
            }
        </div>
    );

}



export default PostArticle;

/*
{
    searchFields.map((field) => { //helperfun abstract out
        const {
            name, id, type, options, values
        } = field;
        switch (type) {
            case 'text':
                return renderField(textFieldParams, id, name, event => handleChange(this, id, event))
            case 'radio':
                return (renderRadio(this, id, name, options, values));
            default:
                return null;
        }
    })
}

 */
