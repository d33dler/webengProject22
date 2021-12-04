import axios from "../http-common";
import _ from "lodash";

class ArticleService {


    getById(id) {
        return axios.get(`/articles`, {
            params: {
                id: `${id}`
            }
        });
    }

    create(data) {
        return axios.post("/articles", data); //test this ?
    }

    updateById(id, data) {
        return axios.put(`/articles/${id}`, data);
    }

    deleteById(id) {
        return axios.delete(`/articles/`, {
                params: {
                    externalId: `${id}`,
                }
            }
        );
    }

    deleteByLocation(lat, long) {
        return axios.delete(`/articles/`, {
                params: {
                    lat: `${lat}`,
                    long: `${long}`
                }
            }
        );
    }


    deleteAll() {
        return axios.delete(`/articles`);
    }

    findByParameter(allArgs) {
        return axios.get(`/top-list/`,
            {
                params: _.pick(allArgs, (value, key) => { return !!value; }) //test this
                //probably needs headers
            });
    }

    findByRent(min, max, format) {
        return axios.get(`/search-budget?`,
            {
                params: {
                    min: `${min}`,
                    max: `${max}`,
                    format: `${format}`
                }
            });
    }

    findByLocation(lat, long, format) {
        return axios.get(`/location?`,
            {
                params: {
                    lat: `${lat}`,
                    long: `${long}`,
                    format: `${format}`
                }
            });
    }
}

export default new ArticleService();