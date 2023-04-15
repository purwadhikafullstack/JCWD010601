import {
  Avatar,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";

const FormModal = ({
  isOpen,
  onClose,
  id,
  handleSubmit,
  modal,
  response,
  preview,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Ubah {modal?.header}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack
            as={Form}
            id={id}
            method="post"
            spacing={5}
            onSubmit={handleSubmit}
          >
            {/* {!actionData?.success ? ( */}
            {!response?.success ? (
              modal?.body ?? <Avatar src={preview} boxSize="xs" />
            ) : (
              <Heading>{modal?.msg}</Heading>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          {/* {!actionData?.success ? ( */}
          {!response?.success ? (
            <Button
              type="submit"
              form={id}
              //  isLoading={navigation.state === "loading"}
            >
              Ubah
            </Button>
          ) : (
            <Button onClick={onClose}>Tutup</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
