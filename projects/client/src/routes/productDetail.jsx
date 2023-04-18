import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../config/config";
import useLocalStorageState from "use-local-storage-state";
import { useSelector } from "react-redux";

const ProductDetailPage = () => {
  const userSelector = useSelector((state) => state.auth);

  const routeParams = useParams();
  const [cart, setCart] = useLocalStorageState("cart");
  const [productIndex, setProductIndex] = useState(null);

  const [count, setCount] = useState(0);
  const [product, setProduct] = useState(null);
  const toast = useToast();

  async function fetchDetailProduct(id) {
    try {
      const res = await axiosInstance.get(`/products/v3/${id}`, {
        withCredentials: true,
      });
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCartClick = () => {
    if (userSelector.id) {
      addItemToCart(product);
    } else {
      toast({
        position: "bottom-left",
        title: "Anda belum terverfikasi",
        description: "Silahkan login agar dapat menggunakan fitur tersebut",
        status: "info",
        duration: 8000,
        isClosable: true,
      });
    }
  };

  const addItemToCart = (product) => {
    if (cart) {
      // Cek apakah produk sudah ada di keranjang
      const itemIndex = cart.findIndex((item) => item.id === product.id);

      if (itemIndex !== -1) {
        // Jika produk sudah ada di keranjang, tambahkan quantity-nya
        const updatedItems = [...cart];
        updatedItems[itemIndex].quantity += count;
        if (updatedItems[itemIndex].quantity > product.totalQuantity) {
          updatedItems[itemIndex].quantity = product.totalQuantity;
          setCart(updatedItems);
          toast({
            title: "Produk sudah ada dikeranjang",
            description: "Jumlah produk tidak telah mencapai batas",
            status: "info",
            duration: 9000,
            isClosable: true,
          });
        } else {
          setCart(updatedItems);
          toast({
            title: "Produk sudah ada dikeranjang",
            description: "Jumlah produk berhasil ditambah",
            status: "info",
            duration: 9000,
            isClosable: true,
          });
        }
      } else {
        // Jika produk belum ada di keranjang, tambahkan produk baru ke keranjang
        const newItem = { id: product.id, quantity: count };
        if (newItem.quantity > product.totalQuantity) {
          newItem.quantity = product.totalQuantity;
          setCart([...cart, newItem]);
        } else {
          setCart([...cart, newItem]);
        }
        toast({
          title: "Sukses menambahkan produk",
          description: "Yeay, kamu sukses menambahkan produk ke keranjang",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      // jika keranjang masih kosong
      if (count > product.quantity) {
        setCart([{ id: product.id, quantity: product.quantity }]);
      } else {
        setCart([{ id: product.id, quantity: count }]);
      }
      toast({
        title: "Sukses menambahkan produk",
        description: "Yeay, kamu sukses menambahkan produk ke keranjang",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    setCount(0);
  };

  useEffect(() => {
    if (!userSelector.id) {
      toast({
        position: "bottom-left",
        title: "Anda belum terverfikasi",
        description:
          "Silahkan login agar dapat mengakses fitur-fitur yang disediakan",
        status: "info",
        duration: 8000,
        isClosable: true,
      });
    }
    fetchDetailProduct(routeParams.id);
  }, []);

  useEffect(() => {
    if (product && cart) {
      console.log("jalan");
      const itemIndex = cart.findIndex((item) => item.id === product.id);
      setProductIndex(itemIndex);
    } else {
      setProductIndex(null);
    }
  }, [cart, product]);

  return (
    <Flex
      mx="auto"
      maxW="5xl"
      boxShadow={{ lg: "0 8px 16px rgba(171, 190, 209, 0.4)" }}
      borderRadius="10px"
      justifyContent="space-evenly"
      flexDir={{ base: "column", lg: "row" }}
      p={"10"}
      gap={10}
    >
      {product ? (
        <>
          {" "}
          <Center flex="1 1 50%">
            <Image src={product.imageUrl} alt="eco bag with food" />
          </Center>
          <VStack alignItems={"start"} flex="1 1 50%" gap={"2"}>
            <Heading fontSize="3xl">{product.name}</Heading>
            <Badge
              w={"max-content"}
              variant="solid"
              colorScheme="blackAlpha"
              textColor={"white"}
            >
              {product.category.name}
            </Badge>
            <Text fontWeight={"semibold"} fontSize="2xl" textColor={"gray.600"}>
              Rp{product.priceRupiahPerUnit.toLocaleString("id-ID")}
            </Text>
            <HStack justifyContent={"space-between"} w={"full"}>
              <Flex
                alignItems="center"
                textColor="#009262"
                bg={"gray.200"}
                borderRadius={"md"}
              >
                <Button
                  onClick={() => {
                    if (count > 0) {
                      setCount(count - 1);
                    }
                  }}
                  variant="solid"
                  bgColor="gray.200"
                >
                  -
                </Button>
                <Text mx={4}>{count}</Text>
                <Button
                  onClick={() => {
                    if (
                      count <
                      product.totalQuantity -
                        (productIndex !== null
                          ? cart[productIndex]?.quantity ?? 0
                          : 0)
                    ) {
                      setCount(count + 1);
                    }
                  }}
                  variant="solid"
                  bgColor="gray.200"
                >
                  +
                </Button>
              </Flex>

              {product.totalQuantity -
                (productIndex !== null &&
                cart !== undefined &&
                cart.length !== 0
                  ? cart[productIndex]?.quantity ?? 0
                  : 0) !==
              0 ? (
                <Text textColor="#009262" fontSize={"md"}>
                  Stock Tersedia
                </Text>
              ) : (
                <Text textColor="gray.500" fontSize={"md"}>
                  Stock Tidak Tersedia
                </Text>
              )}
            </HStack>
            <Button
              bgColor="#009262"
              color="#FCFCFC"
              w="full"
              isDisabled={
                product.totalQuantity === 0 || count === 0 ? true : false
              }
              onClick={handleCartClick}
              _hover={{
                backgroundColor: "#00b377",
              }}
            >
              Tambahkan ke keranjang
            </Button>
            <VStack alignItems={"start"}>
              <Heading fontSize={"md"}>Deskripsi</Heading>
              <Text textColor={"gray.600"}>{product.description}</Text>
            </VStack>
          </VStack>
        </>
      ) : (
        <Center>Loading</Center>
      )}
    </Flex>
  );
};

export default ProductDetailPage;
