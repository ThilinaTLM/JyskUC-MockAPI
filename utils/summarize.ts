export function summarizedInstructions(instructionsSet: any[]) {
    let summary = [];

    instructionsSet.forEach((instructions) => {
        switch (instructions.action) {
            case "setItem":
                summary.push({
                    Action: instructions.action,
                    Raw: instructions,
                    ItemID: instructions.itemId,
                    Quantity: instructions.quantity,
                    Price: instructions.price,
                });
                break;
            case "setDeliveryOption":
                summary.push({
                    Action: instructions.action,
                    Raw: instructions,
                    DeliveryType: instructions.type,
                    Description: instructions.description,
                });
                break;
            case "addTenderItem":
                summary.push({
                    Action: instructions.action,
                    Raw: instructions,
                    TenderID: instructions.tenderId,
                    Amount: instructions.tenderAmount,
                });
                break;
            case "setCustomer":
                summary.push({
                    Action: instructions.action,
                    Raw: instructions,
                    FirstName: instructions.firstName,
                    LastName: instructions.lastName,
                    Email: instructions.customerAddress.email,
                });
                break;
            default:
                summary.push({
                    Action: instructions.action,
                    Raw: instructions,
                });
        }
    })

    return summary;
}
