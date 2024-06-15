class ApiError{
    constructor(status, message="something went wrong",data=null,errors=[]){
        this.status = status;
        this.message = message;
        this.data = data;
        this.success=false;
        this.errors=errors;
    }
}