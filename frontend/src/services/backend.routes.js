import _ from 'lodash';
import axios from '../http-common';

class BackendRoutes {

    getByParam(param, value, meta) {
        return axios.get(`articles/${param}`, {
            params: {
                value: value
            },
            headers: meta
        });
    }

    filterSearch(filter_options, meta) {
        return axios.get(`articles/search/filter`, {
            params: filter_options,
            headers: meta
        })
    }

    filterDelete(filter_options, meta) {
        return axios.delete(`articles/search/filter`, {
            params: filter_options,
            headers: meta
        })
    }

    filterUpdate(filter_options, meta) {
        return axios.patch(`articles/search/filter`, filter_options.fields,
            {
                params: filter_options.conditions,
                headers: meta
            })
    }


    create(data, meta) {
        return axios.post('articles/new', data, {
            headers: meta
        });
    }

    getStatistics(city, body, meta) {
        return axios.get(`articles/statistics/${city}`, {
            params: body,
            headers: meta
        })
    }

}


export default new BackendRoutes();
