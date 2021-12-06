import React, {Component} from 'react';
import ArticleService from '../services/article.service';
import {fieldSet} from './fields_create';


export default class PostArticle extends Component {
    constructor(props) {
        super(props);
        this.uploadArticle = this.uploadArticle.bind(this);
        this.newArticle = this.newArticle.bind(this);
        this.renderRadio = this.renderRadio.bind(this);
        this.renderField = this.renderField.bind(this);
        this.renderField = this.renderField.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.continue = this.continue.bind(this);
        this.state = this.newArticle();
    }

    uploadArticle() {
        ArticleService.create(this.state)
            .then((response) => {
                console.log(response.data);
                this.setState({submitted: true});
            })
            .catch((el) => {
                console.log(el);
            });
    }

    /**
     *
     * @returns {{submitted: boolean}}
     */
    newArticle() {
        let state = {submitted: false};
        for (let i = 0; i < fieldSet.length; i++) {
            state[`${fieldSet[i].id}`] = '';
        }
        return state;
    }

    // eslint-disable-next-line class-methods-use-this
    renderField(arg, tok, fieldName) {
        return (
            <div className="form-group">
                <label style={{marginRight: '20px'}} id={fieldName} htmlFor={tok}>{fieldName}</label>
                <input type="text"
                       id={tok}
                       onChange={(event => this.handleChange(tok, event))}
                       ref={(el) => arg = el}/>
            </div>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    renderRadio(arg, tok, fieldName, options) {
        return (
            <>
                <div>
                    <ul>
                        {this.createLabel(fieldName, tok)}
                        {options.map((o, ix) => (
                            <div className="form-group">
                                <input type="radio"
                                       id={`${tok}_${o}`}
                                       value={o}
                                       onChange={(event => this.handleChange(tok, event))}
                                       checked={this.state[`${tok}`] === o}/>
                                <label htmlFor={`${tok}_${o}`}>{o}</label>
                            </div>
                        ))}
                    </ul>
                </div>
            </>
        )
    }

    createLabel(fieldName, tok) {
        return (<label id={fieldName} htmlFor={tok}>{fieldName}</label>)
    }

    handleChange(value, event) {
        this.setState({[`${value}`]: event.target.value});
    }

    continue() {
        const state = this.newArticle();
        this.setState({...state});
    }

    render() {
        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div>
                        <h4>Article was uploaded into the database!</h4>
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
                                    return (this.renderField(stateField, id, name));
                                case 'radio':
                                    return (this.renderRadio(stateField, id, name, options));
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
