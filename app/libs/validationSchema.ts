import { z } from "zod";

export type CreateUserSchameType = z.infer<typeof createUserSchame>;
export type SignInUserSchemaType = z.infer<typeof signInUserSchema>;
export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;
export const createUserSchame = z
  .object({
    email: z
      .string()
      .email({ message: "آدرس ایمیل خود را به درستی دارد کنید" })
      .min(6)
      .max(50, { message: "ایمیل باید کمتر از 50 کاراکتر باشد" }),
    password: z
      .string()
      .min(8, { message: "گذرواژه باید بیشتر از 8 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" }),
    confirmPassword: z.string(),
    companyName: z
      .string()
      .max(100, { message: "نام سازمان باید کمتر از 100 کاراکتر باشد" })
      .optional(),
    companyBranch: z
      .string()
      .max(50, { message: "نام شعبه باید کمتر از 50 کاراکتر باشد" })
      .optional(),
    itManager: z
      .string()
      .max(50, { message: "نام مسئول انفوماتیک باید کمتر از 50 کاراکتر باشد" })
      .optional(),
    address: z
      .string()
      .max(200, { message: "آدرس باید کمتر از 200 کاراکتر باشد" })
      .optional(),
    image: z.string().min(1).optional(),
    role: z.enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: "تعیین سطح درسترسی الزامی است" }),
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "گذرواژه ها با یکدیگر مطابقت ندارند",
    path: ["confirmPassword"],
  })
  .refine(
    ({ role, companyName, companyBranch, address, itManager }) => {
      if (role === "USER") {
        return (
          companyName?.length! > 0 &&
          companyBranch?.length! > 0 &&
          address?.length! > 0 &&
          itManager?.length! > 0
        );
      }
      return true;
    },
    {
      message: "لطفا تمامی فیلدهای الزامی را پر کنید", // General message for required fields
    }
  )
  .superRefine(
    ({ role, companyName, companyBranch, address, itManager }, ctx) => {
      if (role === "USER") {
        if (!companyName || companyName.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["companyName"],
            message: "وارد کردن نام سازمان الزامی است",
          });
        }
        if (!companyBranch || companyBranch.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["companyBranch"],
            message: "وارد کردن نام شعبه الزامی است",
          });
        }
        if (!itManager || itManager.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["itManager"],
            message: "وارد کردن نام مسئول انفوماتیک الزامی است",
          });
        }
        if (!address || address.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message: "وارد کردن آدرس الزامی است",
          });
        }
      }
    }
  );

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
