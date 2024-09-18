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

export const SignOutConfirmation = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="danger" className="bg-transparent p-0" onPress={onOpen}>
        <PowerIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8  " />
        <p className="whitespace-nowrap text-inherit tracking-wide text-neutral-600 text-[16px]">
          خروج
        </p>
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">خروج</ModalHeader>
              <ModalBody>
                <p>آیا از خروج مطمئن هستید؟</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" onPress={onClose}>
                  انصراف
                </Button>
                <Button
                  color="danger"
                  onPress={() => signOut({ redirect: true, callbackUrl: "/" })}
                >
                  خروج
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
