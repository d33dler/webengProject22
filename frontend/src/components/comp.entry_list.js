import React, {Component} from "react";
import ArticleService from '../services/article.service'

export default class PostArticle extends Component{
    constructor(props) {
        super(props);

        this.state = {
            entries: [],
            currentEntry: null,
            currentIndex: -1,
            id_search: "",
            loc_search: {
                lat: "",
                long: ""
            }
        };
    }
    retrieveEntries = () => {
        ArticleService.getById()
            .then(response => {
                this.setState({
                    entries: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    handleChange = (value, event) => {
        this.setState({[`${value}`]: event.target.value});
    }

    refreshList = () => {
        this.retrieveEntries();
        this.setState({
            currentEntry: null,
            currentIndex: -1
        });
    }

    componentDidMount() {
    }

    render() {
        return null;
    }
}