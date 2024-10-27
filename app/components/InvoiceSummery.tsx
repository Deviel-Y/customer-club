import formatNumber from "@/app/utils/formatNumber";
import { Invoice } from "@prisma/client";

interface Props {
  invoices: Invoice[];
}

const InvoiceSummery = ({ invoices }: Props) => {
  return (
    <div className="flex flex-row max-sm:flex-col max-sm:items-start justify-start gap-20 max-sm:gap-5 mt-5">
      <div className="flex flex-row justify-center items-center">
        <p className="text-base text-gray-500 me-2">جمع مبالغ:</p>
        <p className="text-[25px]">
          {formatNumber(invoices?.reduce((acc, sum) => acc + sum.price, 0))}
        </p>
        <p className="text-base text-gray-600 ms-1">ريال</p>
      </div>

      <div className="flex flex-row justify-center items-center">
        <p className="text-base text-gray-500 me-2">جمع مالیات:</p>
        <p className="text-[25px]">
          {formatNumber(invoices?.reduce((acc, sum) => acc + sum.tax, 0))}
        </p>
        <p className="text-base text-gray-600 ms-1">ريال</p>
      </div>

      <div className="flex flex-row justify-center items-center">
        <p className="text-base text-gray-500 me-2">جمع مبالغ نهایی:</p>
        <p className="text-[25px]">
          {formatNumber(
            invoices?.reduce((acc, sum) => acc + sum.priceWithTax, 0)
          )}
        </p>
        <p className="text-base text-gray-600 ms-1">ريال</p>
      </div>
    </div>
  );
};

export default InvoiceSummery;
