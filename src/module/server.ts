import Koa from 'koa'
import Router from 'koa-router'
import asyncRetry from 'async-retry'
import getPort from 'get-port'
import { Server } from 'http'
import { userHandler, secretHandler } from './handlers'

export class WebServer {
  private app: Koa
  private port: number
  private router: Router
  private server: Server

  constructor() {
    this.app = new Koa()
    this.router = new Router()
  }

  private async setRoutes() {
    this.router.post('/user', userHandler)

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
          this.server = await this.initServer(this.port)
          await this.setRoutes()
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

  public close() {
    console.debug('Closing Server ...')
    this.server.unref()
    this.server.close()
  }

  private initServer(port: number): Promise<Server> {
    return new Promise((resolve, reject) => {
      this.app.on('error', reject)
      const server = this.app.listen(port, () => {
        resolve(server)
      })
    })
  }
}
