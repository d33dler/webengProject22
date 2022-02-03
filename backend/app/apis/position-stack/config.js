const {apiMap, apiGET} = require("../apiManager");
const _ = require("lodash");

/**
 * Geocode Earth 3rd party API script
 * Contains API config and effect function to inject changes into
 * a data object
 */

const add_data = {
    querySequence: ['title', 'postalCode', 'city']
}

function createQuery(inputs, sequence) {
    let queryString = inputs[sequence[0]];
    for (let i = 1; i < sequence.length; i++) {
        queryString = queryString.concat(',' + inputs[sequence[i]]);
    }
    return queryString;
}

exports.config = {
    id: 'position-stack',
    services: [
        {
            id: 'position-stack_get_forward',
            type: 'GET',
            effect: async (body) => {
                const service = {
                    url: 'https://api.geocode.earth/v1/search',
                    params: {
                        api_key: 'ge-2df1235f52e94a7f',
                        text: createQuery(body, add_data.querySequence),
                        limit: 1
                    }
                }
                await apiGET(service).then((res) => {
                    const coords = res.data['features'][0]['geometry']['coordinates'];
                    body['latitude'] = coords[1].toString();
                    body['longitude'] = coords[0].toString();
                }).catch((e) => {
                        console.log(e);
                    }
                )
            }
        },
    ],
}

