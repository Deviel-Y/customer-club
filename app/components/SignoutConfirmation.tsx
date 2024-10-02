import { PowerIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export const SignOutConfirmation = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button color="danger" className="bg-transparent p-0" onPress={onOpen}>
        <PowerIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-9  ps-1" />
        <p className="whitespace-nowrap text-inherit tracking-wide text-neutral-600 text-[16px]">
          خروج
        </p>
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col">خروج</ModalHeader>
              <ModalBody>
                <p>آیا از خروج مطمئن هستید؟</p>
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
                  isLoading={isLoading}
                  color="danger"
                  onPress={() => {
                    setisLoading(true);
                    signOut({ redirect: true, callbackUrl: "/" });
                  }}
                >
                  خروج
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
