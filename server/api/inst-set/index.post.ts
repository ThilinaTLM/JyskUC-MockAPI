import {InstSetRepo} from "~/mongo/repo";
import {InstructionSet} from "~/mongo/model";

export default defineEventHandler(async (event) => {
    const form = await readBody<InstructionSet>(event);

    // Check if the form is valid
    if (!form || !form.id) {
        setResponseStatus(event, 400);
        return { error: "Invalid input" };
    }

    // Set the modified date
    form.modified = new Date();

    setResponseStatus(event, 200);
    return await InstSetRepo.getInstance().save(form)
});
