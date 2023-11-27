import {InstructionSet} from "~/models/instruction";


export default defineEventHandler(async (event ) => {
    const form = await readBody<InstructionSet>(event)
    await useStorage("inst").setItem(form.id, form);
    return form
})