import _ from 'lodash';
import axios from '../http-common';
import {meta_state} from "../components/configs/fields_meta";

class BackendRoutes {

    getByParam(key, value) {
        return axios.get(`articles/${key}/${value}`
            , {
                params: {
                    value: value
                }
            });
    }

    filterSearch(filter_options, meta) {

        return axios.get(`articles/search/filter`
            , {
                params: filter_options,
                headers: meta,
            });
    }

    filterDelete(filter_options, meta) {
        console.log(filter_options);
        return axios.delete(`articles/search/filter`
            , {
                params: filter_options,
                headers: meta
            });
    }

    filterUpdate(filter_options, meta) {
        return axios.patch(`articles/search/filter`
            , filter_options.fields
            , {
                params: filter_options.conditions,
                headers: meta
            });
    }

    create(data) {
        return axios.post('articles/new', data); // test this ?
    }

    getStatistics(city, body) {
        return axios.get(`articles/statistics/${city}`
            , {
                params: body
            })
    }

}


export default new BackendRoutes();
