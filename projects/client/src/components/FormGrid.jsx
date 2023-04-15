import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
} from "@chakra-ui/react";

const FormGrid = ({ children, actionData, entries }) => {
  return (
    <SimpleGrid columns={2} spacingY={10}>
      <FormControl isInvalid={actionData?.errors?.name} isRequired>
        <FormLabel htmlFor="name">Nama</FormLabel>
        {actionData?.errors?.name ? (
          <FormErrorMessage>
            <FormErrorIcon />
            {actionData?.errors?.name?.msg}
          </FormErrorMessage>
        ) : (
          <FormHelperText>Maksimal 255 huruf atau spasi</FormHelperText>
        )}
      </FormControl>
      <FormControl isInvalid={actionData?.errors?.name} isRequired>
        <Input
          name="name"
          id="name"
          maxLength={255}
          pattern="^[a-zA-Z\s]+$"
          defaultValue={entries?.name}
        />
      </FormControl>
      {children}
      <FormControl isInvalid={actionData?.errors?.status} isRequired>
        <FormLabel htmlFor="status">Status</FormLabel>
      </FormControl>
      <FormControl isInvalid={actionData?.errors?.status} isRequired>
        <RadioGroup
          name="status"
          id="status"
          defaultValue={entries?.deletedAt ? "archived" : "published"}
        >
          <HStack spacing={8}>
            <Radio value="published">Terbit</Radio>
            <Radio value="archived">Arsip</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
    </SimpleGrid>
  );
};

export default FormGrid;
