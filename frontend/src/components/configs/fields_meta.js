import {db_config} from "./db_config";

const HEADER_accept = {
    id: 'Accept',
    type: 'select',
    name: 'Response format',
    options: ['JSON', 'CSV'],
    values: ['application/json', 'text/csv']
}

const HEADER_targetDb = {
    id: 'Target-Database',
    type: 'select',
    name: 'Target database',
    options: db_config.map(obj => obj.name),
    values: db_config.map(obj => obj.db_id)
}

export const metaFields_ALL = [
    HEADER_accept,
    HEADER_targetDb
]

export const metaFields_IO = [
    HEADER_accept
]

export const meta_default = {
    'Accept': 'application/json',
    'Target-Database': 'kamernet_db'
}

export const formats = {
    'application/json': '.json',
    'text/csv': '.csv',
}