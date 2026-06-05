import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error.js";

export class UnauthorizedError extends CustomError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
