const fields_search = [
    {
        id: 'externalId',
        tid: 'externalId',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        id: 'rent_min',
        tid: 'rent',
        sqlOp: 'where',
        op: 'gte',
    },
    {
        id: 'rent_max',
        tid: 'rent',
        sqlOp: 'where',
        op: 'lte',
    },
    {
        id: 'areaSqm_min',
        tid: 'areaSqm',
        sqlOp: 'where',
        op: 'gte',
    },
    {
        id: 'areaSqm_max',
        tid: 'areaSqm',
        sqlOp: 'where',
        op: 'lte',
    },
    {
        id: 'title',
        tid: 'title',
        sqlOp: 'where',
        op: 'like',
    },
    {
        id: 'postalCode',
        tid: 'postalCode',
        sqlOp: 'where',
        op: 'like',
    },
    {
        id: 'city',
        tid: 'city',
        sqlOp: 'where',
        op: 'like',
    },
    {
        id: 'areaSqm',
        tid: 'areaSqm',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        id: 'deposit_min',
        tid: 'deposit',
        sqlOp: 'where',
        op: 'gte',
    },
    {
        id: 'deposit_max',
        tid: 'deposit',
        sqlOp: 'where',
        op: 'lte',
    },

    {
        id: 'isRoomActive',
        tid: 'isRoomActive',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        id: 'latitude',
        tid: 'latitude',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        id: 'longitude',
        tid: 'longitude',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        id: 'order',
        tid: 'order',
        sqlOp: 'order',
    },
    {
        id: 'limit',
        tid: 'limit',
        sqlOp: 'limit',
    },
];

const fieldMap = new Map();

fields_search.forEach((o) => {
    fieldMap.set(o.id, o);
});

module.exports = {fieldMap}