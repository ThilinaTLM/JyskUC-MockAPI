
export default defineEventHandler(async (event ) => {
  const form: any = await readBody(event)
  console.log(`[INFO] Order Complete. @type:${form?.payload?.transaction?.['@type']} source:${form?.payload?.transaction?.source} transactionId:${form?.payload?.transaction?.transactionId}`)
  console.debug(`[DEBUG] Order Complete Request Body`, form)
  setResponseStatus(event, 200)
  return {
    "success": true,
  }
})
