import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Icon,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  Th,
  ButtonGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdKeyboardArrowDown, MdReceipt } from "react-icons/md";

const OrderCard = ({ order, onOpenProofModal, onOpenDialogCancel }) => {
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(false);
  const [isListProductsExpanded, setIsListProductsExpanded] = useState(false);

  const handleToggleOrderSummary = () => {
    setIsOrderSummaryExpanded(!isOrderSummaryExpanded);
  };

  const handleToggleListProducts = () => {
    setIsListProductsExpanded(!isListProductsExpanded);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg={"white"}>
      <Flex p={4}>
        <Box flex="4">
          <Table>
            <Thead>
              <Tr bg={"#009262"}>
                <Th textColor={"white"}>Kode Produk</Th>
                <Th textColor={"white"}>Nama Produk</Th>
                <Th isNumeric textColor={"white"}>
                  Harga
                </Th>
                <Th isNumeric textColor={"white"}>
                  Jumlah
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {!isListProductsExpanded ? (
                <Tr
                  key={order.details[0].productId}
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                >
                  <Td>{order.details[0].productId}</Td>
                  <Td>{order.details[0].product.name}</Td>
                  <Td
                    isNumeric
                  >{`Rp${order.details[0].priceRupiahPerUnit.toLocaleString(
                    "id-ID"
                  )}`}</Td>
                  <Td isNumeric>{order.details[0].quantity}</Td>
                </Tr>
              ) : (
                order.details.map((detail) => (
                  <Tr
                    key={detail.productId}
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                  >
                    <Td>{detail.productId}</Td>
                    <Td>{detail.product.name}</Td>
                    <Td
                      isNumeric
                    >{`Rp${detail.priceRupiahPerUnit.toLocaleString(
                      "id-ID"
                    )}`}</Td>
                    <Td isNumeric>{detail.quantity}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
          {order.details.length - 1 !== 0 ? (
            <HStack
              paddingX={"3"}
              paddingY={"4"}
              textColor={"#009262"}
              onClick={handleToggleListProducts}
            >
              {!isListProductsExpanded ? (
                <span> Lihat {order.details.length - 1} produk lainnya</span>
              ) : (
                <span>
                  Sembunyikan {order.details.length - 1} produk lainnya
                </span>
              )}
              <Icon
                as={MdKeyboardArrowDown}
                transform={isListProductsExpanded ? "rotate(180deg)" : ""}
              />
            </HStack>
          ) : null}
        </Box>
        <VStack flex="1" pl={"5"}>
          <Box w={"full"}>
            <Text fontWeight="bold" mb={1}>
              Alamat Pengiriman
            </Text>
            <Text>{order.userAddressFull}</Text>
          </Box>
          <Box w={"full"}>
            <Text fontWeight="bold" mb={1}>
              Ekspedisi Pengiriman
            </Text>
            <Text>{order.shipmentMethod}</Text>
          </Box>
        </VStack>
      </Flex>
      <Box borderTopWidth="1px" p={4}>
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <Text fontWeight="bold">Ringkasan Pesanan</Text>
          <IconButton
            size="md"
            icon={<MdKeyboardArrowDown />}
            aria-label={
              isOrderSummaryExpanded
                ? "Collapse order summary"
                : "Expand order summary"
            }
            onClick={handleToggleOrderSummary}
            transform={isOrderSummaryExpanded ? "rotate(180deg)" : ""}
          />
        </Flex>
        {isOrderSummaryExpanded ? (
          <>
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Text>Total Harga Produk</Text>
              <Text>{`Rp${order.subTotal.toLocaleString("id-ID")}`}</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Text>Biaya Pengiriman</Text>
              <Text>{`Rp${order.shipmentPrice.toLocaleString("id-ID")}`}</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Text fontWeight="bold">Total</Text>
              <Text>{`Rp${order.totalCost.toLocaleString("id-ID")}`}</Text>
            </Flex>
          </>
        ) : (
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <Text fontWeight="bold">Total</Text>
            <Text>{`Rp${order.totalCost.toLocaleString("id-ID")}`}</Text>
          </Flex>
        )}

        <HStack w={"full"} justifyContent={"space-between"} paddingY={"1.5"}>
          <Button
            leftIcon={<MdReceipt />}
            onClick={onOpenProofModal}
            isDisabled={order.paymentImageUrl === null}
          >
            Lihat Bukti Pembayaran
          </Button>

          <ButtonGroup spacing="4">
            {order.status === "UNSETTLED" ||
            order.status === "REQUESTED" ||
            order.status === "PREPARING" ? (
              <Button
                textColor={"#009262"}
                border={"2px"}
                borderColor={"#009262"}
                bgColor={"white"}
                onClick={onOpenDialogCancel}
              >
                Batalkan Pesanan
              </Button>
            ) : null}

            {order.status === "REQUESTED" ? (
              <ButtonGroup spacing="4">
                <Button
                  textColor={"#009262"}
                  border={"2px"}
                  borderColor={"#009262"}
                  bgColor={"white"}
                >
                  Tolak Pembayaran
                </Button>
                <Button
                  textColor={"white"}
                  fontWeight={"bold"}
                  bgColor={"#009262"}
                  _hover={{
                    backgroundColor: "#00b377",
                  }}
                >
                  Konfirmasi Pembayaran
                </Button>
              </ButtonGroup>
            ) : order.status === "PREPARING" ? (
              <ButtonGroup spacing="4">
                <Button
                  textColor={"white"}
                  fontWeight={"bold"}
                  bgColor={"#009262"}
                  _hover={{
                    backgroundColor: "#00b377",
                  }}
                >
                  Kirim Pesanan
                </Button>
              </ButtonGroup>
            ) : null}
          </ButtonGroup>
        </HStack>
      </Box>
    </Box>
  );
};

export default OrderCard;
