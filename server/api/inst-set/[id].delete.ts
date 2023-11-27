import {InstructionSet} from "~/models/instruction";

export default defineEventHandler(async (event ) => {
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

    await instDb.removeItem(id)
    setResponseStatus(event, 200)
    return
})