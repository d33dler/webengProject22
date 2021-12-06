import axios from "../http-common";
import _ from "lodash";

class ArticleService {


    getById(id) {
        return axios.get(`articles/id/${id}`);
    }

    create(data) {
        return axios.post("articles/new", data); //test this ?
    }

    updateById(id, data) {
        return axios.put(`articles/id/${id}`, data);
    }

    deleteById(id) {
        return axios.delete(`articles/id/${id}`);
    }

    deleteByLocation(lat, long) {
        return axios.delete(`articles/location`, {
                params: {
                    lat: `${lat}`,
                    long: `${long}`
                }
            }
        );
    }


    deleteAll() {
        return axios.delete(`articles`);
    }

    findByParameter(allArgs) {
        return axios.get(`articles/top-list/`,
            {
                params: _.pick(allArgs, (value, key) => { return !!value; }) //test this
                //probably needs headers
            });
    }

    findByRent(min, max, format) {
        return axios.get(`articles/search-budget`,
            {
                params: {
                    min: `${min}`,
                    max: `${max}`,
                    format: `${format}`
                }
            });
    }

    findByLocation(lat, long, format) {
        return axios.get(`articles/location?`,
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