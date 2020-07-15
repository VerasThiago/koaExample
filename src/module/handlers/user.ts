import Koa from 'koa'

export async function userHandler(ctx: Koa.ParameterizedContext) {
  ctx.body = 'User Route'
}
