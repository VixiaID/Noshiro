import { GrammyError, HttpError } from 'grammy';

export default function error(err: any) {
  const ctx = err.ctx;
  console.error(`Error on update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error on request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Cannot call Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
}