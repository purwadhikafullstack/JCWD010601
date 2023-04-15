import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useLocalStorageState from "use-local-storage-state";
import CheckoutTables from "../components/CheckoutTables";
import DestinationCard from "../components/DestinationCard";

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [cost, setCost] = useState(null);
  const [shipmentMethod, setShipmentMethod] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const userId = useSelector((state) => state.auth.id);
  const [cart, setCart] = useLocalStorageState("cart");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/${userId}`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        const primaryAddress = res.data.user.primaryAddress;
        if (primaryAddress) {
          setAddressId(
            res.data.user.addresses.find(
              ({ id }) => id == primaryAddress.addressId
            ).id
          );
        }
      } catch (err) {
        console.error(err?.response?.data ?? err);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (cart && cart.length > 0) {
      (async () => {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/products?cart=${cart?.map(
              ({ id }) => id
            )}`
          );
          setProducts(
            res.data.products.map((product) => ({
              ...product,
              quantity: cart.find((item) => item.id == product.id).quantity,
            }))
          );
        } catch (err) {
          console.error(err?.response?.data ?? err);
        }
      })();
    } else {
      setProducts(null);
    }
  }, [cart]);

  useEffect(() => {
    if (products && addressId) {
      (async () => {
        try {
          const totalQuantity = products.reduce(
            (prev, next) => prev + next.quantity,
            0
          );
          const res = await axios.get(
            `http://localhost:8000/api/v1/checkout/cost/${addressId}/${totalQuantity}`,
            { withCredentials: true }
          );
          setCost(res.data);
        } catch (err) {
          console.error(err?.response?.data ?? err);
        }
      })();
    } else {
      setCost(null);
    }
  }, [products, addressId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/api/v1/orders`,
        {
          addressId,
          shipmentMethod,
          shipmentPrice: cost.results[shipmentMethod.toLowerCase()],
          userId,
          warehouseId: cost.warehouseId,
          products,
        },
        { withCredentials: true }
      );
      setCart(null);
      alert("Pesanan terkirim!");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  /** @param {number | null | undefined} int */
  const formatPrice = (int) => `Rp${int?.toLocaleString("id") ?? "--"}`;

  return (
    <>
      <Box as="form" method="post" onSubmit={handleSubmit}>
        <Flex flexDir={{ base: "column", lg: "row" }}>
          <Box
            flex={1}
            px={{ base: 4, lg: 20 }}
            py={{ base: 8, lg: 14 }}
            bgColor="#F5F7FA"
          >
            <Heading fontWeight="normal">Konfirmasi Pesanan</Heading>
            <FormLabel mt={5}>Informasi Kontak</FormLabel>
            <Text>{user?.names[0].name}</Text>
            <Text>{user?.email}</Text>
            <FormControl isRequired>
              <FormLabel mt={5} requiredIndicator>
                Alamat Tujuan
              </FormLabel>
              <DestinationCard
                address={user?.addresses?.find(({ id }) => id == addressId)}
                addressId={addressId}
                handleClick={onOpen}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel mt={5} requiredIndicator>
                Metode Pengiriman
              </FormLabel>
              <RadioGroup name="method" onChange={setShipmentMethod}>
                <VStack align="flex-start">
                  {["JNE", "POS", "TIKI"].map((val) => (
                    <Radio key={val} value={val}>
                      {val}
                      <Text as="span" color="#717171">
                        {` (${formatPrice(
                          cost?.results?.[val.toLowerCase()]
                        )})`}
                      </Text>
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </FormControl>
          </Box>
          <Box flex={1} px={{ lg: 20 }} py={{ base: 8, lg: 14 }}>
            <Heading fontSize="lg">Ringkasan Pembayaran</Heading>
            <CheckoutTables
              products={products}
              shipmentPrice={
                cost &&
                shipmentMethod &&
                cost.results[shipmentMethod.toLowerCase()]
              }
              formatPrice={formatPrice}
            />
            <Flex w="full" justifyContent="center" mt={20}>
              <Button
                type="submit"
                isDisabled={!shipmentMethod || !addressId || !products}
                bgColor="#009262"
                color="#FCFCFC"
                _disabled={{ bgColor: "#F1FBF8", color: "#88939E" }}
              >
                Konfirmasi Pesanan
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alamat Tujuan</ModalHeader>
          <ModalBody>
            <VStack align="stretch">
              {user?.addresses?.map((address) => (
                <DestinationCard
                  key={address.id}
                  address={address}
                  addressId={addressId}
                  onClick={() => setAddressId(id)}
                />
              )) ?? <Text>Tidak ada alamat terdaftar</Text>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckoutPage;
