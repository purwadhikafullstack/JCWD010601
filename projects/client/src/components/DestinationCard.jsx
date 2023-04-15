import { Card, CardBody, Text } from "@chakra-ui/react";

const DestinationCard = ({ address, addressId, handleClick }) => {
  const { id, detail, street, city, province, postalCode } = { ...address };
  return (
    <Card
      cursor="pointer"
      border={addressId === id && "solid 1px #009262"}
      bgColor={addressId === id && "#F1FBF8"}
      onClick={handleClick}
    >
      <CardBody>
        {address ? (
          <>
            <Text fontWeight="semibold">{detail}</Text>
            <Text fontSize="sm">{`${street}, ${city}, ${province} ${postalCode}`}</Text>
          </>
        ) : (
          <Text>--</Text>
        )}
      </CardBody>
    </Card>
  );
};

export default DestinationCard;
