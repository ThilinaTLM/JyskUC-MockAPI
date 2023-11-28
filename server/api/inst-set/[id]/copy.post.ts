import {InstructionSet} from "~/models/instruction";
import {generateRandomID} from "~/utils/generateId";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        setResponseStatus(event, 400)
        return
    }

    const instDb = await useStorage("inst")
    const instSet = await instDb.getItem<InstructionSet>(id)
    if (!instSet) {
        setResponseStatus(event, 404)
        return
    }

    instSet.id = generateRandomID()

    await useStorage("inst").setItem(instSet.id, instSet);
    setResponseStatus(event, 200)
    return instSet.id
})