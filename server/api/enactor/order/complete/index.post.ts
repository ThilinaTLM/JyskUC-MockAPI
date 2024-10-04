
export default defineEventHandler(async (event ) => {
  const form: any = await readBody(event)
  console.log("Requested for completing order. Request Body:", form)
  setResponseStatus(event, 200)
  return {
    "success": true,
  }
})
