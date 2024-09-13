import { z } from "zod";

export type CreateUserSchameType = z.infer<typeof createUserSchame>;

export const createUserSchame = z.object({
  email: z.string().email().min(6).max(50),
  password: z.string().min(8).max(120),
  companyName: z.string().min(1).max(100),
  companyBranch: z.string().min(1).max(50),
  itManager: z.string().min(1).max(50),
  address: z.string().min(1).max(200).optional(),
  image: z.string().min(1).optional(),
});
