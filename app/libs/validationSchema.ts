import { literal, z } from "zod";

export type CreateUserSchameType = z.infer<typeof createUserSchame>;
export type SignInUserSchemaType = z.infer<typeof signInUserSchema>;
export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;

export const createUserSchame = z
  .object({
    email: z.string().email().min(6).max(50),
    password: z.string().min(8).max(120),
    confirmPassword: z.string().min(8).max(120),
    companyName: z.string().min(1).max(100).optional().or(literal("")),
    companyBranch: z.string().min(1).max(50).optional().or(literal("")),
    itManager: z.string().min(1).max(50).optional().or(literal("")),
    address: z.string().min(1).max(200).optional().or(literal("")),
    image: z.string().min(1).optional(),
    role: z.enum(["USER", "ADMIN"]),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "گذرواژه ها با یکدیگر مطابقت ندارند",
    path: ["confirmPassword"],
  });

export const signInUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "وارد کردن آدرس ایمیل اجباری میباشد" })
    .max(40, { message: "آدرس ایمیل باید کمتر از 40 کاراکتر باشد" })
    .email({ message: "ایمیل خود را به درستی وارد کنید" }),
  password: z
    .string()
    .min(8, { message: "رمز عبور باید بیشتر از 8 کاراکتر باشد" })
    .max(50, { message: "رمز عبور باید کمتر از 120 کاراکتر باشد" }),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1).max(999_999),
  organization: z.string().min(1).max(100),
  description: z.string().min(1).max(200),
  organizationBranch: z.string().min(1).max(50),
  assignedToUserId: z.string(),
});
