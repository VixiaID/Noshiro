import { Composer, InlineKeyboard } from 'grammy';

import { encode, decode } from 'js-base64'


const bot = new Composer()
const vmessWsBase = {
  add: 'host',
  aid: '0',
  alpn: '',
  fp: '',
  host: 'host',
  id: 'uuid',
  net: 'ws',
  path: '/path',
  port: 'port',
  ps: 'name',
  scy: 'auto',
  sni: '',
  tls: '',
  type: '',
  v: '2'
}

let vmessUrl: string

bot.hears(/v2ray *(.+)?/, async (ctx) => {
  const url = ctx.match[1]
  if (!url) {
    return ctx.reply('No v2ray url like vmess:// or vless://')
  } else if (/^(vmess|vless):\/\//.test(url) === false) {
    return ctx.reply('No valid v2ray url!')
  }
  const button = new InlineKeyboard().text('TLS', 'tls').text('NON TLS', 'nontls')
  if (url.startsWith('vless://')) {
    return
  }
  await ctx.reply('Select yout vmess type:', {
    reply_markup: button
  })
  vmessUrl = url
})

let userId: number
let vmessType: string

bot.on('callback_query:data', async (ctx) => {
  await ctx.reply('Enter your bug host:', {
    reply_markup: {
      remove_keyboard: true
    }
  })
  userId = ctx.callbackQuery.from.id
  vmessType = ctx.callbackQuery.data
  await ctx.answerCallbackQuery()
})

bot.on('message:text', async (ctx) => {
  if (ctx.from.id === userId) {
    if (vmessUrl.startsWith('vmess://')) {
      const parse = parseVmess(vmessUrl)
      const result = 'vmess://' + vmess(vmessWsBase, parse, ctx.message.text, vmessType)
      await ctx.reply('Here your vmess config:\n' + '`' + result + '`')
    } else if (vmessUrl.startsWith('vless://')) {
      return ctx.reply('Vless converter not available!')
    }
  } else {
    return
  }
})

function parseVmess(url: any) {
  const vmessDecode = decode(url.slice('8'))
  return JSON.parse(vmessDecode)
}

function vmess(config: any, data: any, bug: string, type: string) {
  config.add = type === 'tls' ? data.add || data.host : bug
  config.host = data.add || data.host
  config.port = type === 'tls' ? '443' : '80'
  config.id = data.id
  config.path = data.path
  config.ps = `[${theName()}] VMESS ${type === 'tls' ? 'TLS' : 'NONTLS'}`
  config.type = data.type
  config.tls = type === 'tls' ? 'tls' : 'none'
  config.sni = type === 'tls' ? bug : ''
  return encode(JSON.stringify(config))
}

function theName() {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`
}

export default bot