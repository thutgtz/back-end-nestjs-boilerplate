import { randomUUID } from 'crypto'
import { Request, Response, NextFunction } from 'express'
import * as cls from 'cls-hooked'

const clsNamespace = cls.createNamespace('app')

export function correlationId(req: Request, res: Response, next: NextFunction) {
  const correlationId = randomUUID()
  req.headers.correlationId = correlationId

  clsNamespace.bind(req as any)
  clsNamespace.bind(res as any)

  clsNamespace.run(() => {
    clsNamespace.set('correlationId', correlationId)
    next()
  })
}
