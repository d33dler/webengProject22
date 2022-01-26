import React, {useState} from 'react';
import ArticleService from '../../services/backend.routes';
import {creationFields} from '../configs/fields_create';
import DisplayEntry from "./comp.entry_display";
import {generateForm, generateButton} from "../../func_bin/helper_fun";

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

