import {InstSetRepo} from "~/mongo/repo";


export default defineEventHandler(async (event ) => {
    let id = getRouterParam(event, 'id')
    const form: any = await readBody(event)

    console.log("FORM", form)
    if (!id) {
        id = form?.payload?.["orderUuid"]
    }

    console.log(id)
    if (!id) {
        setResponseStatus(event, 400)
        return
    }

    const instSet = await InstSetRepo.getInstance().findById(id)
    if (!instSet) {
        setResponseStatus(event, 404)
        return
    }

    setResponseStatus(event, 200)
    return {
        "posInstructions": instSet.instructions
    }
})