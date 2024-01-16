export function summarizedInstructions(instructionsSet: any[]) {
    let summary = [];

    instructionsSet.forEach((instructions) => {
        switch (instructions.action) {
            case "setItem":
                summary.push({
                    Action: instructions.action,
                    ItemID: instructions.itemId,
                    Quantity: instructions.quantity,
                    Price: instructions.price
                });
                break;
            case "setDeliveryOption":
                summary.push({
                    Action: instructions.action,
                    DeliveryType: instructions.type,
                    Description: instructions.description
                });
                break;
            case "addTenderItem":
                summary.push({
                    Action: instructions.action,
                    TenderID: instructions.tenderId,
                    Amount: instructions.tenderAmount
                });
                break;
            case "setCustomer":
                summary.push({
                    Action: instructions.action,
                    FirstName: instructions.firstName,
                    LastName: instructions.lastName,
                    Email: instructions.customerAddress.email
                });
                break;
            default:
                summary.push({
                    Action: instructions.action
                });
        }
    })

    return summary;
}
