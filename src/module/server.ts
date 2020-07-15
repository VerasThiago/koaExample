import Koa from 'koa'
import Router from 'koa-router'
import asyncRetry from 'async-retry'
import getPort from 'get-port'
import { userHandler, secretHandler } from './handlers'

export class WebServer {
  private app: Koa
  private port: number
  private router: Router

  constructor() {
    this.app = new Koa()
    this.router = new Router()
  }

  private async initServer(port: number) {
    try {
      this.app.listen(port)
      await this.setRoutes()
    } catch (err) {
      throw err
    }
  }

  private async setRoutes() {
    this.router.get('/user', userHandler)

    this.router.get('/secret', secretHandler)

    this.router.get('/(.*)', (ctx) => {
      ctx.body = 'Default route!'
    })
  }

  private async setPort() {
    const port = await getPort({
      port: getPort.makeRange(3000, 3050),
    })

    this.port = port
  }

  public start() {
    return asyncRetry(
      async (bail) => {
        try {
          await this.setPort()
          await this.initServer(this.port)
          this.app.use(this.router.routes())

          console.debug(`LoginServer started on http://localhost:${this.port}`)
        } catch (err) {
          console.debug(`LoginServer failed to start on port:${this.port}. Reason: ${err.message}.`)
          if (err.code !== 'EADDRINUSE') {
            return bail(err)
          }
        }
      },
      { retries: 2, maxTimeout: 50, minTimeout: 50 }
    )
  }
}
