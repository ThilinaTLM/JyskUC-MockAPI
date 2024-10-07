
export default defineEventHandler(async (event ) => {
  const form: any = await readBody(event)
  console.log(`Order Complete. @type:${form?.transaction?.['@type']} source:${form?.transaction?.source}`)
  console.debug(`[DEBUG] Order Complete Request Body`, form)
  setResponseStatus(event, 200)
  return {
    "success": true,
  }
})
