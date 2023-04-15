import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

const ProductCardUser = ({ product }) => {
  const userSelector = useSelector((state) => state.auth);
  const [cart, setCart] = useLocalStorageState("cart");
  const toast = useToast();

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

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
        updatedItems[itemIndex].quantity += 1;
        if (updatedItems[itemIndex].quantity <= product.totalQuantity) {
          setCart(updatedItems);
          toast({
            title: "Produk sudah ada dikeranjang",
            description: "Jumlah produk berhasil ditambah",
            status: "info",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Produk sudah ada dikeranjang",
            description: "Jumlah produk tidak telah mencapai batas",
            status: "info",
            duration: 9000,
            isClosable: true,
          });
        }
      } else {
        // Jika produk belum ada di keranjang, tambahkan produk baru ke keranjang
        const newItem = { id: product.id, quantity: 1 };
        setCart([...cart, newItem]);
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
      setCart([{ id: product.id, quantity: 1 }]);
      toast({
        title: "Sukses menambahkan produk",
        description: "Yeay, kamu sukses menambahkan produk ke keranjang",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Card maxW={["md", "xs", "xs", "lg"]}>
      <CardBody mb={{ lg: "4", xl: "2" }} onClick={handleCardClick}>
        <Image
          src={product.imageUrl}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          objectFit="cover"
          h={"60%"}
          w={"full"}
        />
        <Stack mt="6" spacing="1">
          <Text fontSize="2xl">
            Rp{product.priceRupiahPerUnit.toLocaleString("id-ID")}
          </Text>
          <Heading size="md">{product.name}</Heading>
          <Text>Stock {product.totalQuantity}</Text>
          <Badge w={"max-content"} variant="solid" colorScheme="orange">
            {product.category.name}
          </Badge>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button
          bgColor="#009262"
          color="#FCFCFC"
          w="full"
          leftIcon={<FaPlus />}
          onClick={handleCartClick}
          isDisabled={product.totalQuantity === 0 ? true : false}
          _hover={{
            backgroundColor: "#00b377",
          }}
        >
          Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCardUser;
