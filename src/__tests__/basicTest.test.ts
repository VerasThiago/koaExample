import { helloWorld } from '../module/basicFunction'

it('Testing hello world', async () => {
  expect.assertions(1)
  const text = await helloWorld()
  expect(text).toEqual('Hello World')
})
