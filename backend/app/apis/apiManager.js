const axios = require('axios');
const apiMap = new Map();
const apiStack = ['./position-stack/config']
/**
 * ApiManager offers 3rd party api calling and mapping functionality
 */

const apiGET = (service) => {
    return axios.get(service.url, {params: service.params});
}

/**
 * maps all 3rd api configs provided by the apiStack array
 */
const map = () => {
    const map = new Map();
    apiStack.forEach(apiScript => {
        const {config} = require(apiScript);
        config.services.forEach(service => {
            map.set(service.id, service);
        })
        apiMap.set(config.id, map);
    })
}

module.exports = {apiMap, map, apiGET}
