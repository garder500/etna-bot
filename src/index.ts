import Bot from "@/bot";
import { PrismaClient } from "@prisma/client";
import pino from "pino";



function init(): void {
  const bot = new Bot();
  const logger = pino({ level: process.env.LOG_LEVEL || "info" });
  bot.logger = logger;
  const prisma = new PrismaClient();

  prisma.$connect().then(() => {
    logger.info("Connected to the database.");
  });
  bot.database = prisma;

  bot.init();

}

init();