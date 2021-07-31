import Koa from 'koa'

import coBody from 'co-body'

interface Data {
  login: string
  password: string
}

export async function userHandler(ctx: Koa.ParameterizedContext) {
  const body: Data = await coBody(ctx.req)

  ctx.body = `Welcome ${body.login}!`
}
