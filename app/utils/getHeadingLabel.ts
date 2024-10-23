export const getHeadingLabel = (path: string): string => {
  if (path === "/userAuth/login") return "";

  if (path === "/admin/invoice-issuing/createNewInvoice")
    return "صدور فاکتور جدید";
  if (path === "/admin/porformaInvoice-issuing") return "صدور پیش فاکتور";
  if (path.includes("editPorInvoiceInfo")) return "مدیریت تیکت ها";
  if (path === "/porformaInvoice") return "پیش فاکتورها";
  if (path === "/admin/porformaInvoice-issuing/createNewPorInvoice")
    return "صدور پیش فاکتور جدید";

  if (path === "/invoice") return "فاکتورها";
  if (path === "/admin/invoice-issuing") return "صدور فاکتور";
  if (path.includes("editInvoiceInfo")) return "ویرایش فاکتور";

  if (path === "/ticket") return "تیکت های من";
  if (path.includes("/ticketDetail")) return "جزئیات تیکت";

  if (path === "/admin/archive/archived-porforma-invoices")
    return "پیش فاکتورهای بایگانی شده";

  if (path === "/admin/logs") return "گزارشات";

  if (path === "/admin/userList") return "مدیریت کاربران";
  if (path === "/admin/createNewUser") return "تعریف کاربر جدید";
  if (path.includes("editUser")) return "ویرایش کاربر";
  if (path.includes("/editUserInfo")) return "ویرایش اطلاعات کاربر";

  if (path.includes("/notification")) return "لیست اعلان ها";

  if (path === "/admin") return "پنل مدیریت";
  if (path === "/") return "داشبورد";
  return "";
};
