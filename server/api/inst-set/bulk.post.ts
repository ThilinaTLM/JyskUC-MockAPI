import {InstructionSet} from "~/mongo/model";
import {InstSetRepo} from "~/mongo/repo";

export default defineEventHandler(async (event) => {
    const form = await readBody<InstructionSet[]>(event);

    // if form is not an array, return error
    if (!Array.isArray(form)) {
        setResponseStatus(event, 400);
        return { error: "Invalid input" };
    }

    // for each form in the array, check if it is valid
    console.log("Bulk Import Request")
    await Promise.all(form.map(async (instSet) => {
        instSet.modified = new Date();
        await InstSetRepo.getInstance().save(form)
        console.log("Bulk Import > Saved", instSet)
    }))

    setResponseStatus(event, 200);
    return
});
