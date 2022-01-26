import _ from 'lodash';
import axios from '../http-common';

class BackendRoutes {
    getById(id) {
        return axios.get(`articles/id/${id}`);
    }

    getByParam(param, value) {
        return axios.get(`articles/${param}`, {
            params: {
                value: value
            }
        });
    }

    filterSearch(filter_options, meta) {
        return axios.get(`articles/search/filter`, {
            params: filter_options,
            headers: meta
        })
    }

    filterDelete(filter_options, meta) {
        console.log(filter_options);
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


    create(data) {
        return axios.post('articles/new', data); // test this ?
    }

    updateById(id, data) {
        return axios.put(`articles/id/${id}`, data);
    }

    deleteById(id) {
        return axios.delete(`articles/id/${id}`);
    }

    deleteByLocation(lat, long) {
        return axios.delete('articles/location', {
            params: {
                lat: `${lat}`,
                long: `${long}`,
            },
        });
    }

    deleteAll() {
        return axios.delete('articles');
    }

    findByParameter(allArgs) {
        return axios.get(
            'articles/top-list/',
            {
                params: _.pick(allArgs, (value, key) => !!value), // test this
                // probably needs headers
            },
        );
    }

    findByRent(min, max, format) {
        return axios.get(
            'articles/search-budget',
            {
                params: {
                    min: `${min}`,
                    max: `${max}`,
                    format: `${format}`,
                },
            },
        );
    }

    findByLocation(lat, long, format) {
        return axios.get(
            'articles/location?',
            {
                params: {
                    lat: `${lat}`,
                    long: `${long}`,
                    format: `${format}`,
                },
            },
        );
    }

    getStatistics(city, body) {
        return axios.get(`articles/statistics/${city}`, {
            params: body
        })
    }

}


export default new BackendRoutes();
