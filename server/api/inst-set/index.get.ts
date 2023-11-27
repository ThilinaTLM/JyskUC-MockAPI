export default defineEventHandler(async (event ) => {
    const instDb = await useStorage("inst")

    const keys = await instDb.getKeys()
    const instSets = await Promise.all(keys.map(async key => instDb.getItem(key)))
    if (!instSets) {
        setResponseStatus(event, 404)
        return
    }

    return instSets
})