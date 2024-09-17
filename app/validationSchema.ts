import { z } from "zod";

export type CreateUserSchameType = z.infer<typeof createUserSchame>;
export type SignInUserSchemaType = z.infer<typeof signInUserSchema>;

export const createUserSchame = z.object({
  email: z.string().email().min(6).max(50),
  password: z.string().min(8).max(120),
  companyName: z.string().min(1).max(100),
  companyBranch: z.string().min(1).max(50),
  itManager: z.string().min(1).max(50),
  address: z.string().min(1).max(200).optional(),
  image: z.string().min(1).optional(),
});

export const signInUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "دارد کردن آدرس ایمیل جباری میباشد" })
    .max(40, { message: "آدرس ایمیل باید کمتر از 40 کاراکتر باشد" })
    .email({ message: "ایمیل خود را به درستی وارد کنید" }),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید بیشتر از 8 کاراکتر باشد" })
    .max(50, { message: "رمز عبور باید کمتر از 120 کاراکتر باشد" }),
});
