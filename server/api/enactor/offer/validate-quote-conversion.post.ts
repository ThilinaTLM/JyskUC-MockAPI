export default defineEventHandler(async (event ) => {
    setResponseStatus(event, 200)
    return {
        "validConversion": true,
        "message": "Your order has been validated by Nadeesha Hettiarachchi"
    }
})
