import {InstructionSet} from "~/models/instruction";


export default defineEventHandler(async (event ) => {
    const form = await readBody<InstructionSet>(event)
    if (!form) {
        setResponseStatus(event, 400)
        return
    }

    if (!form.id) {
        setResponseStatus(event, 400)
        return
    }

    // set modified date
    form.modified = new Date()

    await useStorage("inst").setItem(form.id, form);
    return form
})