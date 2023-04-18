import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { Link as RouterLink, NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Flex bgColor="#F5F7FA" h="100vh">
      <Flex
        flexDir="column"
        justifyContent="space-between"
        p={4}
        bgColor="#FCFCFC"
        borderRight="solid 1px #E7E7E7"
        w={60}
      >
        <VStack spacing={5} color="#717171">
          <Heading
            as={RouterLink}
            to="/admin"
            fontSize="xl"
            color="#009262"
            py={10}
          >
            Niagajaya
          </Heading>
          <Heading w="full" fontSize="sm" fontWeight="medium">
            MENU
          </Heading>
          <Button as={NavLink} to="/admin" variant="ghost" w="full" pr={2}>
            <Icon as={FaHome} mr={2.5} />
            <Text as="span" w="full">
              Beranda
            </Text>
          </Button>
          <Divider />
        </VStack>
        <Flex>
          <Avatar borderRadius="10px" />
          <Box>
            <Heading>Shimarin</Heading>
            <Text>Manager</Text>
          </Box>
        </Flex>
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default AdminLayout;
