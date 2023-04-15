import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CategoryCardUser = ({ category, hue, saturation, lightness }) => {
  const navigate = useNavigate();
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const clickHandler = () => {
    navigate(`/products?categoryId=${category.id}`);
  };

  return (
    <Button
      w={{ base: "full", md: "200px" }}
      h={{ base: "50px", md: "200px" }}
      bgColor={color}
      borderRadius="md"
      boxShadow="md"
      p={4}
      onClick={clickHandler}
    >
      <Flex h="100%" alignItems="center" justifyContent="center">
        <Center>
          <Text
            fontWeight={{ base: "semibold", md: "bold" }}
            fontSize={{ base: "md", md: "xl" }}
          >
            {category.name}
          </Text>
        </Center>
      </Flex>
    </Button>
  );
};

export default CategoryCardUser;
