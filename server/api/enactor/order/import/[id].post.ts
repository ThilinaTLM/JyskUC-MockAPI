import {InstructionSet} from "~/models/instruction";


export default defineEventHandler(async (event ) => {
    let id = getRouterParam(event, 'id')
    const form: any = await readBody(event)

    if (!id) {
        id = form?.payload?.["orderUuid"]
    }

    console.log(id)
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

    setResponseStatus(event, 200)
    return {
        "posInstructions": instSet.instructions
    }
})