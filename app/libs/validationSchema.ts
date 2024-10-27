import { literal, z } from "zod";

export type AdminSide_userSchameType = z.infer<typeof adminSide_userSchame>;
export type UserSide_userSchameType = z.infer<typeof userSide_userSchame>;
export type FullUserSchameType = z.infer<typeof fullUserSchame>;
export type SignInUserSchemaType = z.infer<typeof signInUserSchema>;
export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;
export type PorInvoiceSchemaType = z.infer<typeof porInvoiceSchema>;
export type TicketSchemaType = z.infer<typeof ticketSchema>;
export type TicketMessageSchemaType = z.infer<typeof ticketMessageSchema>;
export type ModifyPorInvoiceType = z.infer<typeof modifyPorInvoice>;

export const adminSide_userSchame = z
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
      .regex(/\d.*\d/, { message: "گذرواژه باید حداقل شامل دو عدد باشد" })
      .optional()
      .or(literal("")),
    confirmPassword: z.string().optional().or(literal("")),
    adminName: z
      .string()
      .max(50, { message: "نام ادمین باید کمتر از 50 کاراکتر باشد" })
      .min(1, { message: "فیلد مسئول الزامی می باشد" })
      .or(literal("")),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "گذرواژه ها با یکدیگر مطابقت ندارند",
      path: ["confirmPassword"],
    }
  );

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
      .regex(/\d.*\d/, { message: "گذرواژه باید حداقل شامل دو عدد باشد" })
      .optional()
      .or(literal("")),
    confirmPassword: z.string().optional().or(literal("")),
    companyBranch: z
      .string()
      .max(50, { message: "نام شعبه باید کمتر از 50 کاراکتر باشد" })
      .min(1, { message: "فیلد نام شعبه الزامی می باشد" }),
    itManager: z
      .string()
      .max(50, { message: "نام مسئول باید کمتر از 50 کاراکتر باشد" })
      .min(1, { message: "فیلد مسئول الزامی می باشد" }),
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
    adminName: z.string().min(1).max(50).optional().nullable().or(literal("")),
    currentPassword: z
      .string()
      .min(5, { message: "گذرواژه باید بیشتر از 5 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" })
      .optional()
      .or(z.literal("")),
    newPassword: z
      .string()
      .min(8, { message: "گذرواژه باید بیشتر از 8 کاراکتر باشد" })
      .max(120, { message: "گذرواژه باید کمتر از 120 کاراکتر باشد" })
      .regex(/\d.*\d/, { message: "گذرواژه باید حداقل شامل دو عدد باشد" })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    companyName: z
      .string()
      .max(100, { message: "نام سازمان باید کمتر از 100 کاراکتر باشد" })
      .optional()
      .nullable(),
    companyBranch: z
      .string()
      .max(50, { message: "نام شعبه باید کمتر از 50 کاراکتر باشد" })
      .optional()
      .nullable(),
    itManager: z
      .string()
      .max(50, { message: "نام مسئول باید کمتر از 50 کاراکتر باشد" })
      .optional()
      .nullable(),
    address: z
      .string()
      .max(200, { message: "آدرس باید کمتر از 200 کاراکتر باشد" })
      .optional()
      .nullable(),
    image: z.string().min(1).optional(),
    role: z
      .enum(["CUSTOMER", "ADMIN", "SUPER_ADMIN"], {
        errorMap: () => ({ message: "تعیین سطح درسترسی الزامی است" }),
      })
      .default("CUSTOMER"),
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
      if (role === "CUSTOMER") {
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
    (
      { role, companyName, companyBranch, address, itManager, adminName },
      ctx
    ) => {
      if (role === "CUSTOMER") {
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
            message: "وارد کردن نام مسئول الزامی است",
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
      if (role === "ADMIN") {
        if (!adminName || adminName.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["adminName"],
            message: "وارد کردن نام ادمین الزامی است",
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
    .max(120, { message: "رمز عبور باید کمتر از 120 کاراکتر باشد" }),
});

export const invoiceSchema = z.object({
  invoiceNumber: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(30, { message: "شماره فاکتور تباید از 30 کاراکتر بیشتر باشد" }),
  organization: z
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
  price: z
    .number({ message: "برای وارد کردن مقدار، از اعداد استفاده کنید" })
    .min(1)
    .max(999_999_999_999, {
      message: "مبلغ فاکتور از این حد نمیتواند بیشتر باشد",
    }),
  tax: z
    .number({ message: "برای وارد کردن مقدار، از اعداد استفاده کنید" })
    .min(1, { message: "وارد کردن این مقدار الزامی می باشد" })
    .max(999_999_999, {
      message: "مبلغ مالیات از این حد نمیتواند بیشتر باشد",
    }),
  priceWithTax: z
    .number({ message: "برای وارد کردن مقدار، از اعداد استفاده کنید" })
    .min(1, { message: "وارد کردن این مقدار الزامی می باشد" })
    .max(999_999_999_999, {
      message: "مبلغ نهایی از این حد نمیتواند بیشتر باشد",
    }),
  sendNotification: z
    .boolean({ message: "وارد کردن این مقدار الزامی می باشد" })
    .default(true),
});

export const porInvoiceSchema = z.object({
  porformaInvoiceNumber: z
    .string()
    .min(1, { message: "وارد کردن این فیلد الزامی مبیاشد" })
    .max(30, { message: "شماره پیش فاکتور تباید از 30 کاراکتر بیشتر باشد" }),
  organization: z
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
  expiredAt: z
    .string({ message: "وارد کردن این فیلد الزامی مبیاشد" })
    .datetime(),
});

export const ticketSchema = z.object({
  category: z.enum([
    "TECHNICAL_SUPPORT",
    "PAYMENT",
    "FEATURE_REQUEST",
    "GENERAL_INQUIRY",
  ]),
  title: z.string().min(1).max(255),
});

export const ticketMessageSchema = z.object({
  message: z
    .string()
    .min(1, "برای ارسال پاسخ، متن پاسخ الزامی می باشد")
    .max(60_000, "متن پاسخ بیش از حد بلند می باشد"),
});

export const modifyPorInvoice = z.object({
  fromDate: z
    .string({ message: "وارد کردن این فیلد الزامی مبیاشد" })
    .datetime(),
  toDate: z.string({ message: "وارد کردن این فیلد الزامی مبیاشد" }).datetime(),
});
