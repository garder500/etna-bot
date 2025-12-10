import Bot from "@/bot";
import { PrismaClient } from "@db/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import pino from "pino";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});


function init(): void {
  const bot = new Bot();
  const logger = pino({ level: "info", formatters: { level: (label) => { return { level: label }; } }, timestamp: () => `,"time":"${new Date().toISOString()}"` });
  bot.logger = logger;
  const prisma = new PrismaClient({adapter});

  prisma.$connect().then(() => {
    logger.info("Connected to the database.");
  });
  bot.database = prisma;

  bot.init();
}

init();