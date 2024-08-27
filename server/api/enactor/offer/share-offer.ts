
export default defineEventHandler(async (event) => {
    setResponseStatus(event, 200)
    return {
        "posInstructions": [],
        "uiHelper": {
            "currentStep": "1",
            "nextStep": "2"
        }
    }
})
