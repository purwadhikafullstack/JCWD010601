import { Box, Card, CardBody, Heading, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddressCard = ({ address }) => {
  const navigate = useNavigate();

  return (
    <Card
      variant={"outline"}
      borderColor={"green.400"}
      w={"full"}
      bgColor="#F1FBF8"
    >
      <CardBody>
        <HStack w={"full"} justifyContent={"space-between"}>
          {address.main ? (
            <Heading
              size={"xs"}
              mb={"1"}
              bg={"gray.500"}
              paddingX={2}
              paddingY={1}
              textColor={"white"}
              borderRadius={"md"}
            >
              Alamat Utama
            </Heading>
          ) : (
            <Box></Box>
          )}
          <Heading
            size={"xs"}
            mb={"1"}
            textColor={"green.400"}
            onClick={() => {
              navigate(`/settings/address/edit/${address.id}`);
            }}
          >
            Edit
          </Heading>
        </HStack>
        <Heading size="md">{address.detail}</Heading>
        <Text fontSize={"sm"} textColor={"gray"}>
          {address.street}, {address.city}, {address.province},{" "}
          {address.postalCode}
        </Text>
      </CardBody>
    </Card>
  );
};
export default AddressCard;
