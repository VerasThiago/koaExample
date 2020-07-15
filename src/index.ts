import { WebServer } from './module/server'

const server = new WebServer()

async function run() {
  await server.start()
}

run()
