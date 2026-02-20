class ClientError extends Error {
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "ClientError";
    this.statusCode = statusCode;
  }
}

export default ClientError;
