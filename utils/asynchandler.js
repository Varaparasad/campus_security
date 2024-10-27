const asynchandler=(fn)=>{
    return async (req,res,next) => {
        try {
            await fn(req,res,next)
        } catch (error) {
            res.status(500 || error.code).json({
                "message":error.message,
                "success":"flase"
            })
        }
    }
}

export default asynchandler