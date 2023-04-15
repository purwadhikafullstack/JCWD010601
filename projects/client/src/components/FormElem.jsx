import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";

/**
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {Object} props.error
 * @param {string} props.helperText
 */
const FormElem = ({ children, error, helperText }) => {
  return (
    <FormControl isRequired isInvalid={error}>
      <FormLabel m="0" requiredIndicator>
        {children}
      </FormLabel>
      {error ? (
        <FormErrorMessage mt={1} fontSize="x-small">
          <FormErrorIcon />
          {error?.msg}
        </FormErrorMessage>
      ) : (
        <FormHelperText mt={1} fontSize="x-small">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormElem;
