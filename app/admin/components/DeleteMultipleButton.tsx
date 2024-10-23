"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  listOfIds?: string[];
  setListOfIds: (ids: string[]) => void;
}

export const DeleteMutipleButton = ({ listOfIds, setListOfIds }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setisLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div>
        <Button
          variant="light"
          size="sm"
          className="w-full"
          color="danger"
          onPress={onOpen}
          isDisabled={!listOfIds || listOfIds.length === 0}
        >
          {pathname.includes("porformaInvoice")
            ? "حذف پیش فاکتورها"
            : "حذف فاکتورها"}
        </Button>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <div>
                <ModalHeader className="flex flex-col">
                  {pathname.includes("porformaInvoice")
                    ? "حذف پیش فاکتور"
                    : "حذف فاکتور"}
                </ModalHeader>
                <ModalBody>
                  <p>
                    {pathname.includes("porformaInvoice")
                      ? "آیا از حذف پیش فاکتورهای انتخاب شده مطمئن هستید؟ این عمل غیر قابل بازگشت میباشد"
                      : "آیا از حذف فاکتورهای انتخاب شده مطمئن هستید؟ این عمل غیر قابل بازگشت میباشد"}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    isDisabled={isLoading}
                    color="primary"
                    variant="solid"
                    onPress={onClose}
                  >
                    انصراف
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isLoading}
                    onPress={() => {
                      setisLoading(true);

                      axios
                        .delete(
                          `${
                            pathname.includes("porformaInvoice")
                              ? "/api/porformaInvoice/deleteMultiple"
                              : "/api/invoice/deleteMultipleInvoice"
                          }`,
                          {
                            data: listOfIds,
                          }
                        )
                        .then(() => {
                          toast.success("حذف با موفقیت انجام شد");
                          router.push(
                            `${
                              pathname.includes("porformaInvoice")
                                ? "/admin/porformaInvoice-issuing"
                                : "/admin/invoice-issuing"
                            }`
                          );
                          router.refresh();
                        })
                        .catch((error: AxiosError) =>
                          toast.error(error.response?.data as string)
                        )
                        .finally(() => {
                          setisLoading(false);
                          onClose();
                          setListOfIds([]);
                        });
                    }}
                  >
                    حذف
                  </Button>
                </ModalFooter>
              </div>
            )}
          </ModalContent>
        </Modal>
      </div>
      <Toaster />
    </>
  );
};
