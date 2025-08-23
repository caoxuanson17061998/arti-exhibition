/* eslint-disable */
// Import PrismaClient từ generated client
import {PrismaClient} from "@prisma/client";

// Khai báo biến global cho PrismaClient để tránh tạo nhiều instance khi develop
// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error"],
  });
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  prisma = globalThis.prisma;
}

export default prisma;
