export class LogModel {
  correlationId?: string
  endpoint?: string
  userId?: string
  body?: object
  param?: object
  message?: string
  response?: string
  errorStack?: string
  statusCode?: string
  httpStatusCode?: string

  toReadAbleFormat() {
    return [
      `ENDPOINT: ${this.endpoint}`,
      `USERID: ${this.userId}`,
      `RID: ${this.correlationId}`,
      `MSG: ${this.message}`,
      `BODY: ${this.body}`,
      `STATUS: ${[this.httpStatusCode, this.statusCode].join(',')}`,
    ]
      .filter((e) => e?.length > 10)
      .join('\n')
  }
}
