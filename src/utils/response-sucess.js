const ResponseSuccess = (message, data = null) => {
  return {
    "meta": {
      "success": true,
      "code": 200,
      "message": message
    },
    "data": data
  }
}
 
export default ResponseSuccess;