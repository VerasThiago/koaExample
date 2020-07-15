import Koa from 'koa'

export async function secretHandler(ctx: Koa.ParameterizedContext) {
  ctx.body = 'Secret Route'
}
