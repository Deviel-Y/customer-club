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

                      const myPromise = axios
                        .delete("/api/porformaInvoice/deleteMultiple", {
                          data: listOfIds,
                        })
                        .then(() => {
                          router.push("/admin/porformaInvoice-issuing");
                          router.refresh();
                        })
                        .finally(() => {
                          setisLoading(false);
                          onClose();
                          setListOfIds([]);
                        });

                      toast.promise(myPromise, {
                        error: (error: AxiosError) =>
                          error.response?.data as string,
                        loading: "در حال حذف...",
                        success: "پیش فاکتورها با موفقیت حذف شدند",
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
