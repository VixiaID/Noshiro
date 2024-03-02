import { Composer } from 'grammy';

const bot = new Composer()

bot.command('ping', async (ctx) => {
  const lastDate = Date.now()
  const msg = await ctx.reply('Ping')
  const nowDate = Date.now()
  const ping: Number = nowDate - lastDate
  await ctx.api.editMessageText(ctx.chat.id, msg.message_id, `Pong ${ping}ms`)
})

export default bot