export const fieldSet = [
    {
        name: 'City',
        id: 'city',
        type: 'text'
    },
    {
        name: 'Population N',
        id: 'population',
        type: 'checkbox',
        fun: 'COUNT',
    },
    {
        name: 'Mean rent',
        id: 'mean_rent',
        type: 'checkbox',
    },
    {
        name: 'Mean deposit',
        id: 'mean_deposit',
        type: 'checkbox',
    },
    {
        name: 'Median rent',
        id: 'med_rent',
        type: 'checkbox',
    },
    {
        name: 'Median deposit',
        id: 'med_deposit',
        type: 'checkbox',
    },
    {
        name: 'SD rent',
        id: 'sd_rent',
        type: 'checkbox',
        fun: 'STD',
    },
    {
        name: 'SD deposit',
        id: 'sd_deposit',
        type: 'checkbox',
    }
]