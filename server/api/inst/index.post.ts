import {InstructionSet} from "~/models/instruction";


export default defineEventHandler(async (event ) => {
    // Read the incoming request data
    const buffer = await event.node.req.read();

    // Assuming the request sends JSON data, parse it into an InstructionSet object
    let instSet: InstructionSet;
    try {
        instSet = JSON.parse(buffer.toString()) as InstructionSet;
    } catch (error) {
        // Handle parsing error, perhaps send a bad request response
        event.node.res.statusCode = 400;
        return {
            status: 400,
            message: "Invalid JSON format"
        };

    }

    // You can now use the parsed instSet data
    // For example, saving it to the storage
    await useStorage("inst").setItem(instSet.id, instSet);

    // Respond with a success message
    return {
        message: 'Instruction set created successfully',
        status: 200,
        data: instSet
    };

})