export const fields_search = [
    {
        id: 'externalId',
        type: 'text',
        name: 'External Id',
        placeholder: 'ID',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        id: 'rent',
        type: 'range',
        name: 'Rent',
        placeholder: '€',
        sqlOp: ['gte', 'lte'],
        op: 'like',
    },
    {
        name: 'Address',
        id: 'address',
        type: 'text',
        placeholder: 'street name',
        sqlOp: 'where',
        op: 'like',
    },
    {
        name: 'Postal Code',
        id: 'postalCode',
        type: 'text',
        placeholder: 'code',
        sqlOp: 'where',
        op: 'like',
    },
    {
        name: 'City',
        id: 'city',
        type: 'text',
        placeholder: 'city',
        sqlOp: 'where',
        op: 'like',
    },
    {
        name: 'Area',
        id: 'areaSqm',
        type: 'range',
        placeholder: 'm^2',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        name: 'Deposit',
        id: 'deposit',
        type: 'range',
        placeholder: '€',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        name: 'Room active',
        id: 'isRoomActive',
        type: 'radio',
        options: ['Any', 'Y', 'N'],
        values: ['', 'true', 'false'],
        placeholder: 'ID',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        name: 'Order:',
        id: 'order',
        child: 'order_by',
        type: 'radio',
        options: ['None', 'Ascending', 'Descending'],
        values: ['', 'ASC', 'DESC'],
        placeholder: '-',
        sqlOp: 'order',
    },
    {
        name: 'Order by:',
        parent: 'order',
        id: 'order_by',
        type: 'radio',
        options: ['Rent', 'Deposit', 'Area(m2)'],
        values: ['rent', 'deposit', 'areaSqm'],
        placeholder: 'orderBy',
        sqlOp: 'order',
    },
    {
        name: 'Limit ',
        id: 'limit',
        type: 'text',
        placeholder: '<=N?',
        sqlOp: 'limit',
    },
];

const fieldMap = new Map();

export const all_fields =
    [
        {id: 'externalId'},
        {id: 'rent'},
        {id: 'areaSqm_min'},
        {id: 'areaSqm_max'},
        {id: 'deposit_min'},
        {id: 'deposit_max'},
        {id: 'isRoomActive'},
        {id: 'limit'},
        {id: 'order'},
        {id: 'order_by'},
        {id: 'isRoomActive'},
        {id: 'areaSqm'},
        {id: 'city'},
        {id: 'address'},
        {id: 'rent_min'},
        {id: 'rent_max'},
        {id: 'postalCode'}
    ]


fields_search.forEach((o) => {
    fieldMap.set(o.id, o);
});

export {fieldMap}