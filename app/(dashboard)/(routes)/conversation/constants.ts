import * as z from "zod";


export const formSchema = z.object({
    address: z.string().min(1, {
      message: "Address is required",
    }),
    keywords: z.string().optional()
  });