"use server"

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function logExpense(formData: FormData) {
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;

  await prisma.dailyBurn.create({
    data: {
      amount,
      category,
    }
  });

  revalidatePath("/");
}