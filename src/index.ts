import { Bot, Context, webhookCallback } from 'grammy';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';

import express from 'express';
import 'dotenv/config';

import handleError from './helpers/error';
import loadPlugin from './helpers/plugin';


async function main() {
  if (!process.env.BOT_TOKEN) {
    throw new Error('Bot token not available!');

  }

  const bot = new Bot<ParseModeFlavor<Context>>(process.env.BOT_TOKEN as string)

  bot.command('start', (ctx) => {
    ctx.reply('Hi')
    console.log(ctx.message)
  })

  bot.catch((err) => handleError(err));

  loadPlugin(bot)

  bot.use(hydrateReply)
  bot.api.config.use(parseMode('MarkdownV2'))

  if (process.env.NODE_ENV === 'production') {
    if (process.env.BOT_LOG_ID) {
      await bot.api.sendMessage(process.env.BOT_LOG_ID, 'Startup now')
    }
    const port = process.env.PORT || 3000;
    const app = express();
    app.use(express.json());
    app.use(`/${bot.token}`, webhookCallback(bot, 'express'));
    app.listen(port, () => console.log(`Listening port ${port}`));
  } else {
    await bot.init()
    bot.start()
    console.log(`Bot ${bot.botInfo.username} is up and running`)
  }
}

void main()