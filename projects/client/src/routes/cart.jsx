import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Icon,
  VStack,
  useBreakpointValue,
  StackDivider,
  Checkbox,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../config/config";
import { MdDelete } from "react-icons/md";
import { RiShoppingCartLine } from "react-icons/ri";
import useLocalStorageState from "use-local-storage-state";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setcart] = useLocalStorageState("cart");
  const cancelRef = useRef();
  const {
    isOpen: isOpenDialogDelete,
    onOpen: onOpenDialogDelete,
    onClose: onCloseDialogDelete,
  } = useDisclosure();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDelete, setSelectedDelete] = useState({});

  const showTable = useBreakpointValue({ base: false, md: true });

  const handleQuantityChange = (productId, quantity) => {
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts[productIndex].quantity = quantity;

      let newCart = [];
      for (let i = 0; i < updatedProducts.length; i++) {
        newCart.push({
          id: updatedProducts[i].id,
          quantity: parseInt(updatedProducts[i].quantity),
        });
      }
      setcart(newCart);
    }
  };

  const handleProductToggle = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.filter((id) => id !== productId)
      );
    } else {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        productId,
      ]);
    }
  };

  const handleAllProductToggle = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const submitHandler = () => {
    const myOrderCart = cart.filter((product) =>
      selectedProducts.includes(product.id)
    );
    console.log("myOrderCart");
    console.log(myOrderCart);
  };

  const totalPrice = selectedProducts.reduce((acc, productId) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    const price = selectedProduct.priceRupiahPerUnit * selectedProduct.quantity;
    return acc + price;
  }, 0);

  useEffect(() => {
    async function fetchProducts(productIds) {
      try {
        const result = await axiosInstance.post("/products/v4", { productIds });

        const mergedProducts = cart.map((product) => ({
          ...result.data.find((pd) => pd.id === product.id),
          quantity: product.quantity,
        }));

        setProducts(mergedProducts);
      } catch (error) {
        console.error(error);
      }
    }

    if (cart) {
      const myProductIds = cart.map((product) => {
        return product.id;
      });
      fetchProducts(myProductIds);
    }
  }, [cart]);

  const handleDelete = (productId) => {
    const productIndex = products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts.splice(productIndex, 1);
      let newCart = [];
      for (let i = 0; i < updatedProducts.length; i++) {
        newCart.push({
          id: updatedProducts[i].id,
          quantity: parseInt(updatedProducts[i].quantity),
        });
      }
      setSelectedDelete({});
      setcart(newCart);
    }
  };

  return (
    <VStack alignItems={"start"}>
      <Heading>Keranjang saya</Heading>
      {products.length === 0 ? (
        <Center h={"50vh"} w="100%">
          <VStack>
            <Icon as={RiShoppingCartLine} boxSize={"14"} />
            <Text
              fontWeight={"bold"}
              textAlign={"center"}
              fontSize={{ base: "md", md: "xl" }}
            >
              Keranjang belanja anda masih kosong
            </Text>
            <Text>Silahkan isi keranjang belanja anda</Text>
            <Button
              bgColor="#009262"
              color="#FCFCFC"
              onClick={() => {
                navigate("/products");
              }}
              _hover={{
                backgroundColor: "#00b377",
              }}
            >
              Kembali Belanja
            </Button>
          </VStack>
        </Center>
      ) : (
        <>
          <Box
            w="100%"
            boxShadow={{
              base: "0 8px 16px rgba(171, 190, 209, 0.4)",
            }}
            borderRadius="10px"
            p={{ base: "2", md: "5" }}
          >
            {showTable ? (
              <Table w="100%">
                <Thead>
                  <Tr>
                    <Th w={"5%"}>
                      <Checkbox
                        isChecked={selectedProducts.length === products.length}
                        onChange={handleAllProductToggle}
                      >
                        <Text fontSize={"xs"}>Pilih Semua</Text>
                      </Checkbox>
                    </Th>
                    <Th w={"25%"}>Produk</Th>
                    <Th w={"15%"} isNumeric>
                      Harga satuan
                    </Th>
                    <Th w={"15%"}>Jumlah</Th>
                    <Th isNumeric>Total Harga</Th>
                    <Th w={"5%"}>aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products &&
                    products.map((product) => (
                      <Tr key={product.id}>
                        <Td>
                          <Checkbox
                            isChecked={selectedProducts.includes(product.id)}
                            onChange={() => handleProductToggle(product.id)}
                          ></Checkbox>
                        </Td>
                        <Td>
                          <Flex align="center">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              w={"64"}
                              mr={4}
                            />
                            <Text fontSize={"md"} fontWeight={"semibold"}>
                              {product.name}
                            </Text>
                          </Flex>
                        </Td>
                        <Td isNumeric>
                          Rp{product.priceRupiahPerUnit.toLocaleString("id-ID")}
                        </Td>
                        <Td>
                          <NumberInput
                            size="sm"
                            defaultValue={product.quantity}
                            min={0}
                            max={product.totalQuantity}
                            maxW={"40"}
                            value={product.quantity}
                            onChange={(value) =>
                              handleQuantityChange(product.id, value)
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                        <Td isNumeric>
                          Rp
                          {(
                            product.priceRupiahPerUnit * product.quantity
                          ).toLocaleString("id-ID")}
                        </Td>
                        <Td>
                          <IconButton
                            icon={<MdDelete />}
                            variant="outline"
                            colorScheme="red"
                            onClick={() => {
                              onOpenDialogDelete();
                              setSelectedDelete({
                                id: product.id,
                                name: product.name,
                              });
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  <Tr>
                    <Td colSpan={2}>
                      <Text fontWeight="bold">Total Keseluruhan:</Text>
                    </Td>
                    <Td isNumeric colSpan={4}>
                      <Text fontWeight="bold">
                        Rp
                        {selectedProducts.length !== 0
                          ? totalPrice.toLocaleString("id-ID")
                          : "-"}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            ) : (
              <VStack
                w="100%"
                alignItems={"start"}
                divider={<StackDivider borderColor="gray.200" />}
              >
                <Checkbox
                  isChecked={selectedProducts.length === products.length}
                  onChange={handleAllProductToggle}
                >
                  Pilih Semua
                </Checkbox>
                {products &&
                  products.map((product) => (
                    <Flex key={product.id} w="100%" mt={2} p={2}>
                      <Checkbox
                        isChecked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                      ></Checkbox>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        w={"28"}
                        marginX={4}
                        boxSize={{ base: "90px", md: "150px" }}
                      />
                      <Box flex="1">
                        <Text>{product.name}</Text>
                        <Text>
                          Rp
                          {(
                            product.priceRupiahPerUnit * product.quantity
                          ).toLocaleString("id-ID")}{" "}
                        </Text>
                        <HStack alignContent={"space-between"}>
                          <NumberInput
                            size="sm"
                            defaultValue={product.quantity}
                            min={0}
                            max={product.totalQuantity}
                            onChange={(value) =>
                              handleQuantityChange(product.id, parese)
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <Box mt={4}>
                            <IconButton
                              icon={<MdDelete />}
                              variant="outline"
                              colorScheme="red"
                              onClick={() => {
                                onOpenDialogDelete();
                                setSelectedDelete({
                                  id: product.id,
                                  name: product.name,
                                });
                              }}
                            />
                          </Box>
                        </HStack>
                        {/* <Text>Total Price: {product.price * product.quantity}</Text> */}
                      </Box>
                    </Flex>
                  ))}
                <Box w="100%" mt={4}>
                  <Text fontWeight="bold">
                    Total keseluruhan: Rp
                    {selectedProducts.length !== 0
                      ? totalPrice.toLocaleString("id-ID")
                      : "-"}
                  </Text>
                </Box>
              </VStack>
            )}
            <Button
              mt={"3"}
              bgColor="#009262"
              color="#FCFCFC"
              w="full"
              onClick={submitHandler}
              isDisabled={selectedProducts.length === 0 ? true : false}
              _hover={{
                backgroundColor: "#00b377",
              }}
            >
              Pesan
            </Button>
          </Box>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onCloseDialogDelete}
            isOpen={isOpenDialogDelete}
            isCentered
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Hapus produk</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Apakah Anda yakin ingin menghapus produk {selectedDelete.name}{" "}
                dalam keranjang?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant={"outline"}
                  colorScheme={"teal"}
                  ref={cancelRef}
                  onClick={onCloseDialogDelete}
                >
                  Nanti Saja
                </Button>
                <Button
                  ml={3}
                  bgColor={"#009262"}
                  textColor={"white"}
                  onClick={() => {
                    handleDelete(selectedDelete.id);
                    onCloseDialogDelete();
                  }}
                >
                  Ya, Hapus
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </VStack>
  );
};

export default CartPage;
