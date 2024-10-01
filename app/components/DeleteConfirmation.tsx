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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
}

export const DeleteConfirmation = ({ id }: Props) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  return (
    <div>
      <Button isIconOnly color="danger" onPress={onOpen}>
        <TrashIcon className="min-w-5 w-4" />
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col">حذف کاربر</ModalHeader>
              <ModalBody>
                <p>آیا از حذف این کاربر مطمئن اید؟</p>
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
                      .delete(`/api/userAuth/${id}`)
                      .then(() => router.refresh());
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
  );
};
