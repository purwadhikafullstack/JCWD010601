import { Box, Center, Flex, Heading, Image, VStack } from "@chakra-ui/react";
import { Form } from "react-router-dom";

/**
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {unknown} props.actionData
 * @param {string} props.src
 * @param {string} props.alt
 * @param {string} props.heading
 */
const AuthLayout = ({ children, actionData, src, alt, heading }) => {
  return (
    <Flex
      mx="auto"
      maxW="5xl"
      boxShadow={{ lg: "0 8px 16px rgba(171, 190, 209, 0.4)" }}
      borderRadius="10px"
      justifyContent="space-evenly"
      flexDir={{ base: "column-reverse", lg: "row" }}
    >
      <Center>
        <Image src={src} alt={alt} />
      </Center>
      {!actionData?.success ? (
        <Center py={10} flexDir="column">
          <Heading fontSize="3xl" mb={5}>
            {heading}
          </Heading>
          <Box
            border="solid #EBEBEB 1px"
            borderRadius="10px"
            p={5}
            w={{ base: "full", lg: 96 }}
          >
            <VStack as={Form} method="post" spacing={5}>
              {children}
            </VStack>
          </Box>
        </Center>
      ) : (
        <Center>
          <Heading>{actionData.msg}</Heading>
        </Center>
      )}
    </Flex>
  );
};

export default AuthLayout;
