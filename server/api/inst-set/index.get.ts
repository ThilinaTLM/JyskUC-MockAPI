import {InstSetRepo} from "~/mongo/repo";

export default defineEventHandler(async (event ) => {
    const instSets = await InstSetRepo.findAll()
    if (!instSets) {
        setResponseStatus(event, 404)
        return
    }
    return instSets
})