"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
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
  endpoint: string;
  title: string;
  content: string;
  successMessage: string;
  iconStyle: string;
  buttonSize?: "sm" | "md" | "lg";
}

export const DeleteConfirmationButton = ({
  endpoint,
  content,
  title,
  successMessage,
  iconStyle,
  buttonSize = "md",
}: Props) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  return (
    <div>
      <Button size={buttonSize} isIconOnly color="danger" onPress={onOpen}>
        <TrashIcon className={iconStyle} />
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col">{title}</ModalHeader>
              <ModalBody>
                <p>{content}</p>
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
                      .delete(endpoint)
                      .then(() => {
                        router.refresh();
                        toast.success(successMessage);
                      })
                      .catch((error: AxiosError) => {
                        setisLoading(false);
                        onClose();
                        toast.error(error?.response?.data as string);
                      });
                  }}
                >
                  حذف
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
        <Toaster />
      </Modal>
    </div>
  );
};