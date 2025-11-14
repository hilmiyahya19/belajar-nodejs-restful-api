import { prismaClient } from "../src/application/database.js";

export default async () => {
  await prismaClient.$disconnect();
};
