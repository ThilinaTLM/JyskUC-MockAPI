const validators = [
    "Nadeesha Hettiarachchi",
    "Upuli Lochana",
    "Dilusha Jeewanthi"
]

export default defineEventHandler(async (event) => {
    setResponseStatus(event, 200)
    const randomValidator = validators[Math.floor(Math.random() * validators.length)]
    return {
        "validConversion": true,
        "message": {
            "severity": "INFO",
            "messageText": `Your order has been validated by ${randomValidator}`,
            "additionalData": {}
        }
    }
})
