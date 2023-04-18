import { Avatar, Box, IconButton, Input } from "@chakra-ui/react";
import { useRef } from "react";
import { FaImages } from "react-icons/fa";
import FormElem from "./FormElem";

const ImageInput = ({ name, src, error, form, handleChange }) => {
  const inputRef = useRef(null);

  return (
    <Box w="min-content">
      <FormElem helperText="Hanya boleh (PNG/JPEG) dibawah 1MB">
        <Avatar size="2xl" src={src} pos="relative">
          <IconButton
            icon={<FaImages />}
            aria-label="ubah foto profil"
            pos="absolute"
            h="full"
            w="full"
            borderRadius="full"
            bgColor="blackAlpha.700"
            fontSize="3xl"
            _hover={{ bgColor: "blackAlpha.800" }}
            onClick={() => {
              inputRef.current.value = null;
              inputRef.current.click();
            }}
          />
        </Avatar>
        <Input
          type="file"
          display="none"
          name={name}
          accept="image/png, image/jpeg"
          ref={inputRef}
          form={form}
          onChange={handleChange}
        />
      </FormElem>
    </Box>
  );
};

export default ImageInput;
