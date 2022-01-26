export const fields_meta = [
    {
        id: 'Accept',
        type: 'select',
        name: 'Response format',
        options: ['JSON', 'CSV'],
        values: ['application/json', 'text/csv']
    }
]

export const meta_default = {
    'Accept' : 'application/json'
}

export const formats = {
    'application/json': '.json',
    'text/csv' : '.csv',
}