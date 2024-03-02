import { Composer } from 'grammy';
import fs from 'fs';
import path from 'path';

export default function loadPlugin(bot: any, directory = 'plugins') {
  const location = path.join(__dirname, '../' + directory);
  const inside = fs.readdirSync(location);
  for (const content of inside) {
    const stat = fs.statSync(path.join(location, content));
    if (stat.isDirectory()) {
      loadPlugin(path.join(directory, content));
    } else {
      if (content.endsWith('.ts')) {
        console.log('Load plugin', path.parse(content).name);
        const plugin = require(path.join(location, content));
        for (const [key, value] of Object.entries(plugin)) {
          if (value instanceof Composer) {
            bot.use(value);
          }
        }
      }
    }
  }
}