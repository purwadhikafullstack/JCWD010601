import { IconButton, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import StyledInput from "./StyledInput";

/** @param {import("react").InputHTMLAttributes<HTMLInputElement>} props */
const PaswordInput = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible((val) => !val);
  };

  return (
    <InputGroup>
      <StyledInput type={isVisible ? "text" : "password"} pr={10} {...props} />
      <InputRightElement w={10}>
        <IconButton
          aria-label="toggle password visibility"
          icon={isVisible ? <FaEye /> : <FaEyeSlash />}
          variant="ghost"
          size="sm"
          tabIndex={-1}
          onClick={handleClick}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PaswordInput;
