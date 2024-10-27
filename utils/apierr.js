class apierr extends Error {
    constructor(
        statuscode,
        message="Something went wrong",
        errors="",
        stack,
    ) {
        super(message)
        this.statuscode=statuscode
        this.message=message
        this.errors=errors
        if(!stack){
            Error.captureStackTrace(this,this.constructor)
        }
        else{
            this.stack=stack
        }
    }
}

export default apierr