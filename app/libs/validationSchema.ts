import { literal, z } from "zod";

export type UserSide_userSchameType = z.infer<typeof userSide_userSchame>;
export type FullUserSchameType = z.infer<typeof fullUserSchame>;
export type SignInUserSchemaType = z.infer<typeof signInUserSchema>;
export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;
export type PorInvoiceSchemaType = z.infer<typeof porInvoiceSchema>;

export const userSide_userSchame = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "گذرواژه باید بیشتر از 8 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" })
      .optional()
      .or(literal("")),
    newPassword: z
      .string()
      .min(8, { message: "گذرواژه باید بیشتر از 8 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" })
      .optional()
      .or(literal("")),
    confirmPassword: z.string().optional().or(literal("")),
    companyBranch: z
      .string()
      .max(50, { message: "نام شعبه باید کمتر از 50 کاراکتر باشد" })
      .min(1, { message: "فیلد نام شعبه الزامی می باشد" }),
    itManager: z
      .string()
      .max(50, { message: "نام مسئول انفوماتیک باید کمتر از 50 کاراکتر باشد" })
      .min(1, { message: "فیلد مسئول انفوماتیک الزامی می باشد" }),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "گذرواژه ها با یکدیگر مطابقت ندارند",
      path: ["confirmPassword"],
    }
  );

export const fullUserSchame = z
  .object({
    email: z
      .string()
      .email({ message: "آدرس ایمیل خود را به درستی وارد کنید" })
      .min(6)
      .max(50, { message: "ایمیل باید کمتر از 50 کاراکتر باشد" })
      .optional(),
    currentPassword: z
      .string()
      .min(8, { message: "گذرواژه باید بیشتر از 8 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" })
      .optional()
      .or(literal("")),
    newPassword: z
      .string()
      .min(8, { message: "گذرواژه باید بیشتر از 8 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" })
      .optional()
      .or(literal("")),
    confirmPassword: z.string().optional().or(literal("")),
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
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "گذرواژه ها با یکدیگر مطابقت ندارند",
      path: ["confirmPassword"],
    }
  )
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
      message: "لطفا تمامی فیلدهای الزامی را پر کنید",
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
  invoiceNumber: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(30, { message: "شماره فاکتور تباید از 30 کاراکتر بیشتر باشد" }),
  assignedToUserId: z
    .string({ message: "وارد کردن این فیلد الزامی مبیاشد" })
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(100, { message: "نام سازمان تباید از 100 کاراکتر بیشتر باشد" }),
  description: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(200, { message: "توضیحات تباید از 200 کاراکتر بیشتر باشد" }),
  organizationBranch: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(50, { message: "نام شعبه تباید از 50 کاراکتر بیشتر باشد" }),
});

export const porInvoiceSchema = z.object({
  invoiceNumber: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(30, { message: "شماره پیش فاکتور تباید از 30 کاراکتر بیشتر باشد" }),
  assignedToUserId: z
    .string({ message: "وارد کردن این فیلد الزامی مبیاشد" })
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(100, { message: "نام سازمان تباید از 100 کاراکتر بیشتر باشد" }),
  description: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(200, { message: "توضیحات تباید از 200 کاراکتر بیشتر باشد" }),
  organizationBranch: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(50, { message: "نام شعبه تباید از 50 کاراکتر بیشتر باشد" }),
  expireDate: z.string().datetime(),
});
