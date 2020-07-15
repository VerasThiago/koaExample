import { helloWorld } from './module/basicFunction'

async function print() {
  console.log(await helloWorld())
}

print()
