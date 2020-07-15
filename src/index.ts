import { WebServer } from './module/server'

const server = new WebServer()

function run() {
  server.start()
}

run()

process.on('SIGINT', () => {
  server.close()
})
