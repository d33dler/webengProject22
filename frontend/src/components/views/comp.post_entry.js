import React, {useState} from 'react';
import ArticleService from '../../services/backend.routes';
import {createQuery, creationFields} from '../configs/fields_create';
import DisplayEntry from "./comp.display_entry";
import {
    generateForm,
    generateButton,
    checkRepresentation,
    convertDownloadable,
    generateDownloadLink
} from "../utils/helper_fun";
import structuredClone from "@ungap/structured-clone";
import {formats, meta_default, metaFields_IO} from "../configs/fields_meta";


const PostArticle = () => {

    const [fieldSet, updateFieldSet] = useState(creationFields);
    const [inputs, setInputs] = useState({});
    const [state, setState] = useState({submitted: false});
    const [data, setData] = useState(null);
    const [meta, setMetaData] = useState(structuredClone(meta_default))

    function uploadArticle() {
        ArticleService.create(inputs, meta)
            .then((res) => {
                handleResponse(res);
            }).catch((el) => {
            console.log(el);
            window.alert(el)
        });
    }

    function handleResponse(res) {
        checkRepresentation(res, setData, res.data);
        convertDownloadable(res, meta, setStateParam)
        setStateParam('submitted', true);
    }

    function refresh() {
        setState({submitted: false});
        setData(null);
        setMetaData(structuredClone(meta_default))
        setInputs({});
    }

    function setStateParam(param, value) {
        setState(prevState => ({
            ...prevState,
            [param]: value
        }))
    }

    return (
        <div className="submit-form">
            {state.submitted ? (
                <div>
                    {data ?
                        <span>
                        <DisplayEntry data={data}/>

                            {generateDownloadLink(state.download,
                                'Download file ' + formats[meta.Accept])}
                    </span> :
                        <span>
                           <h2> UI representation not available.
                            You may download the query result</h2>
                            {generateDownloadLink(state.download,
                                'Download file ' + formats[meta.Accept])}
                    </span>}
                    <h5>Article was uploaded into the database!</h5>
                    {generateButton('Continue', refresh)}
                </div>
            ) : (
                <form>
                    {generateForm(fieldSet, inputs, setInputs)}
                    {generateForm(metaFields_IO, meta, setMetaData)}
                    {generateButton("Submit", uploadArticle)}
                </form>)
            }
        </div>
    );

}


export default PostArticle;