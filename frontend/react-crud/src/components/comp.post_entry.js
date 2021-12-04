import React, {Component, createRef} from "react";
import ArticleService from "../services/article.service";
import {fields} from "./fields_create"

export default class PostArticle extends Component {

    constructor(props) {
        super(props);
        this.uploadArticle = this.uploadArticle.bind(this);
        this.newArticle = this.newArticle.bind(this);
        this.newArticle()
    }

    uploadArticle() {
        ArticleService.create(this.state.fields)
            .then(response => {
                this.setState({submitted: response.data.submitted});
                console.log(response.data);
            })
            .catch(el => {
                console.log(el);
            });
    }

    newArticle() {
        for (let i = 0; i < fields.length; i++) {
            this.state[`${fields[i].id}`] = ''
        }
    }


    renderField(arg, tok, field_name) {
        return <div className="form-group">
            <label id={field_name} htmlFor={tok}>{field_name}</label>
            <input type="text" id={tok} ref={el => arg = el}/>
        </div>
    }

    renderRadio(arg, tok, field_name, options) {
        return (options.map((o, ix) => <div className="form-group">
            <label id={field_name} htmlFor={tok}>{field_name}</label>
            <input type="radio" id={`${tok}_${o}`} value={o} ref={el => arg = el}/>
        </div>))
    }

    render() {
        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div>
                        <h4>Article was uploaded into the database!</h4>
                        <button className="btn btn-success" onClick={
                            this.newArticle
                        }>
                            Upload
                        </button>
                    </div>
                ) : (
                    <div>
                        {fields.map((field) => {
                            const {name, id, type, options} = field;
                            switch (type) {
                                case "text":
                                    return (this.renderField(this.state[`${id}`], id, name));
                                case "radio":
                                    return (this.renderRadio(this.state[`${id}`], id, name, options))
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

PostArticle.defaultProps = {
    address: "",
    postalCode: "",
    city: "",
    areaSqm: "",
    rent: "",
    deposit: null,
    isRoomActive: true,
    latitude: "",
    longitude: "",
    submitted: false
};