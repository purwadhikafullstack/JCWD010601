import { Input } from "@chakra-ui/react";

/** @param {import("react").InputHTMLAttributes<HTMLInputElement> & import("@chakra-ui/react").InputProps} props */
const StyledInput = (props) => {
  return (
    <Input bgColor="#F1FBF8" borderRadius="4px" variant="filled" {...props} />
  );
};

export default StyledInput;
