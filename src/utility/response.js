const successResponse = (res,statusCode,msg,data={})=>{
    res.status(statusCode).json({
        status:'success',
        msg:msg,
        data:data
    })

};

const errorResponse = (res,statusCode,msg,error={})=>{
    res.status(statusCode).json({
        status:'fail',
        msg:msg,
        error:error.toString(),
    })
}


module.exports = {successResponse,errorResponse}