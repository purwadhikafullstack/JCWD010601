import { Box, Flex, FormLabel, IconButton, Input } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

const ProfileItem = ({ id, label, defaultValue, handleClick }) => {
  return (
    <Box w="full">
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      <Flex>
        <Input
          id={id}
          defaultValue={defaultValue}
          variant="filled"
          borderRightRadius="none"
          isDisabled
        />
        <IconButton
          icon={<FaEdit />}
          ml={1}
          borderLeftRadius="none"
          onClick={handleClick}
        />
      </Flex>
    </Box>
  );
};

export default ProfileItem;
