function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const helloWorld = async () => {
  await delay(2000)

  return 'Hello World'
}
