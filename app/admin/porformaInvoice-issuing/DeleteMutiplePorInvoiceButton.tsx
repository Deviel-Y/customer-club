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
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  listOfIds?: string[];
  setListOfIds: (ids: string[]) => void;
}

export const DeleteMutiplePorInvoiceButton = ({
  listOfIds,
  setListOfIds,
}: Props) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

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
          حذف پیش فاکتورها
        </Button>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <div>
                <ModalHeader className="flex flex-col">
                  حذف پیش فاکتورها
                </ModalHeader>
                <ModalBody>
                  <p>
                    آیا از حذف پیش فاکتورهای انتخاب شده مطمئن هستید؟ این عمل غیر
                    قابل بازگشت است
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
                        .delete("/api/porformaInvoice/deleteMultiple", {
                          data: listOfIds,
                        })
                        .then(() => {
                          toast.success("پیش فاکتورها با موفقیت حذف شدند");
                          router.push("/admin/porformaInvoice-issuing");
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
