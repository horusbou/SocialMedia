class HttpException extends Error {
    status: number;
    message: string;
    options: object | undefined;
    constructor(status: number, message: string, options?: object) {
        super(message);
        this.status = status;
        this.message = message;
        this.options = options;
    }
}

export default HttpException;
