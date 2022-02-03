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
        placeholder: 'rent',
        sqlOp: ['gte', 'lte'],
        op: 'like',
    },
    {
        name: 'Address',
        id: 'title',
        type: 'text',
        placeholder: 'Something-straat',
        sqlOp: 'where',
        op: 'like',
    },
    {
        name: 'Postal Code',
        id: 'postalCode',
        type: 'text',
        placeholder: "< XXXX >< AB >",
        sqlOp: 'where',
        op: 'like',
    },
    {
        name: 'City',
        id: 'city',
        type: 'text',
        placeholder: 'Groningen',
        sqlOp: 'where',
        op: 'like',
    },
    {
        name: 'Area (m2)',
        id: 'areaSqm',
        type: 'range',
        placeholder: '0 - ...',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        name: 'Deposit',
        id: 'deposit',
        type: 'range',
        placeholder: '0 - ...',
        sqlOp: 'where',
        op: 'eq',
    },
    {
        name: 'Latitude ',
        id: 'latitude',
        type: 'number',
        placeholder: '< decimal >',
        sqlOp: 'like',
    },
    {
        name: 'Longitude ',
        id: 'longitude',
        type: 'number',
        placeholder: '< decimal >',
        sqlOp: 'like',
    },
    {
        name: 'Room active?:',
        id: 'isRoomActive',
        type: 'radio',
        options: ['Any', 'Yes', 'No'],
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
        placeholder: '',
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
        type: 'number',
        placeholder: 'N',
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
        {id: 'title'},
        {id: 'rent_min'},
        {id: 'rent_max'},
        {id: 'postalCode'}
    ]


fields_search.forEach((o) => {
    fieldMap.set(o.id, o);
});

export {fieldMap}