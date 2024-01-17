
type ExtraInfoTag = {
    name: string,
    value: string,
    color?: string,
}

export function extractDataFromInstruction(instructions: any): ExtraInfoTag[] {
    if (instructions.action === "setItem") {
        return [
            { name: "PID", value: instructions.itemId, color: "green" },
            { name: "Qt", value: instructions.quantity, color: "blue" },
            { name: "Price", value: instructions.price },
        ]
    } else if (instructions.action === "setDeliveryOption") {
        return [
            { name: "Delivery", value: instructions.type },
        ]
    } else if (instructions.action === "addTenderItem") {
        return [
            { name: "TID", value: instructions.tenderId },
            { name: "Amount", value: instructions.tenderAmount },
        ]
    } else if (instructions.action === "setCustomer") {
        return [
            { name: "", value: instructions.firstName },
            { name: "", value: instructions.lastName },
            { name: "", value: instructions?.customerAddress?.email },
        ]
    } else if (instructions.action === "addCollectionItem") {
        return [
            { name: "PID", value: instructions.collectionProductId },
            { name: "Qt", value: instructions.collectionQuantity },
            { name: "Price", value: instructions.price },
        ]
    } else if (instructions.action === "removeItem") {
        return [
            { name: "REF", value: instructions.enactorRef },
            { name: "Reason", value: instructions.reason }
        ]
    } else if (instructions.action === "addUserNotification") {
        return [
            { name: "Level", value: instructions.userNotification?.severity },
        ]
    } else if (instructions.action === "setTxText") {
        return [
            { name: "OP", value: instructions.operation },
        ]
    } else if (instructions.action === "addCollectionHeaderItem") {
        return [
            { name: "OID", value: instructions.customerOrderId },
            { name: "Ext", value: instructions.isExternalOrder },
        ]
    }
    else {
        return []
    }
}

export function summarizeInstructionSet(instructionsSet: any[]) {
    return instructionsSet.map((iSet: any) => ({
        action: iSet.action,
        raw: iSet,
        extraInfo: extractDataFromInstruction(iSet).filter((e: any) => e.value !== undefined),
    }))
}