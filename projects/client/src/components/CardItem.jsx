import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

const CardItem = ({ detail }) => {
  const { priceRupiahPerUnit, quantity, product } = detail;
  return (
    <HStack spacing={4}>
      <Avatar
        src={`http://localhost:8000/products/${product.imageUrl}`}
        name={product.name}
        size="xl"
        borderRadius="sm"
        border="solid 1px #E7E7E7"
      />
      <Box>
        <Text fontWeight="bold">{product.name}</Text>
        <Text>{`${quantity} x Rp${priceRupiahPerUnit.toLocaleString(
          "id"
        )}`}</Text>
      </Box>
    </HStack>
  );
};

export default CardItem;
