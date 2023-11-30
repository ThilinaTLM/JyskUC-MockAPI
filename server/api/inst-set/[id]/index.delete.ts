import {InstructionSet} from "~/mongo/model";
import {InstSetRepo} from "~/mongo/repo";

export default defineEventHandler(async (event ) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        setResponseStatus(event, 400)
        return
    }

    const instSet = await InstSetRepo.findById(id)
    if (!instSet) {
        setResponseStatus(event, 404)
        return
    }

    await InstSetRepo.deleteById(id)
    setResponseStatus(event, 200)
    return
})