import React, {Component} from 'react';
import ArticleService from '../services/article.service';
import {fieldSet} from './fields_create';
import DisplayEntry from "./comp.display_entry";
import {renderField, renderRadio, newState, handleChange} from "./helper_fun";
import {textFieldParams, checkboxParams} from "./params_field_types";

export default class PostArticle extends Component {
    constructor(props) {
        super(props);
        this.state = newState(fieldSet, '');
    }

    uploadArticle = () => {
        ArticleService.create(this.state)
            .then((response) => {
                console.log(response.data);
                this.setState({submitted: true, data: response.data});
            })
            .catch((el) => {
                console.log(el);
            });
    }


    continue = () => {
        const state = newState(fieldSet, '');
        this.setState({...state});
    }

    render() {
        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div>
                        <h5>Article was uploaded into the database!</h5>
                        <DisplayEntry data={this.state.data}/>
                        <button
                            className="btn btn-success"
                            onClick={this.continue}>
                            Continue
                        </button>
                    </div>
                ) : (
                    <div>
                        {fieldSet.map((field) => {
                            const {
                                name, id, type, options
                            } = field;
                            const {[id]: stateField} = this.state;
                            switch (type) {
                                case 'text':
                                    return (renderField(this, textFieldParams,stateField, id, name,
                                        (event => handleChange(this, id, event))));
                                case 'radio':
                                    return (renderRadio(this, stateField, id, name, options));
                                default:
                                    return null;
                            }
                        })}
                        <button onClick={this.uploadArticle} className="btn btn-success">
                            Submit
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
