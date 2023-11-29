export default [
    {
        name: 'Set Item 1',
        instructions: [
            {
                action: "setItem",
                itemId: "1",
                quantity: 2,
                price: 10000,
                ucOrder: "test_1",
                ucLineItem: 1,
            },
        ]
    },
    {
        name: 'Set Item 2',
        instructions: [
            {
                action: "setItem",
                itemId: "2",
                quantity: 2,
                price: 6000,
                ucOrder: "test_1",
                ucLineItem: 1,
            },
        ]
    },
    {
        name: 'address delivery',
        instructions: [
            {
                action: "setDeliveryOption",
                type: "address",
                description: "Address delivery",
                reference: "addressDelivery",
            }
        ]
    },
    {
        name: 'store pickup',
        instructions: [
            {
                action: "setDeliveryOption",
                type: "store",
                description: "Store delivery",
                reference: "locationCollectionDelivery",
            }
        ]
    },
]