export interface EndPointError {
  statusCode: number;
  timeStamp: Date;
  path: string;
  error: {
    message: string;
    error: string;
    statusCode: number;
  };
}
