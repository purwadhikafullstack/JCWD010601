import {
  Button,
  Center,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationNav from "../components/PaginationNav";
import PaymentModal from "../components/PaymentModal";
import UserOrderCard from "../components/UserOrderCard";

const OrdersPage = () => {
  const [data, setData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/orders/${userId}?${searchParams.toString()}&take=3`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        console.error(err?.response.data ?? err);
      }
    })();
  }, [userId, searchParams]);

  return (
    <>
      <VStack spacing={{ base: 6, lg: 12 }} align="stretch">
        <Heading fontWeight={8}>Daftar Pesanan</Heading>
        <HStack spacing={5} overflowX="auto" pb={1}>
          <Text fontWeight="bold" mx={2.5}>
            Status
          </Text>
          {[
            { text: "Biaya", status: "UNSETTLED" },
            { text: "Aju", status: "REQUESTED" },
            { text: "Olah", status: "PREPARING" },
            { text: "Kirim", status: "SENDING" },
            { text: "Tuntas", status: "DELIVERED" },
            { text: "Batal", status: "CANCELLED" },
          ].map(({ text, status }) => (
            <Button
              key={status}
              variant="outline"
              color="#88939E"
              borderColor="solid 1px rgba(00, 00, 00, 0.2)"
              borderRadius="10px"
              isActive={searchParams.get("status") === status}
              _active={{ bgColor: "#F1FBF8", color: "#009262" }}
              flexShrink={0}
              onClick={() =>
                setSearchParams((val) => {
                  val.set("status", val.get("status") === status ? "" : status);
                  return val;
                })
              }
            >
              {text}
            </Button>
          ))}
        </HStack>
        <VStack spacing={5} align="stretch">
          {data?.orders?.length ? (
            data.orders.map((order, idx) => (
              <UserOrderCard
                key={idx}
                order={order}
                handleOpen={() => {
                  setOrderId(order.id);
                  onOpen();
                }}
                handleCancel={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:8000/api/v1/orders/detail/${order.id}`,
                      { withCredentials: true }
                    );
                    navigate(0);
                  } catch (err) {
                    console.error(err?.response.data ?? err);
                  }
                }}
              />
            ))
          ) : (
            <Center
              h={96}
              bgColor="#FCFCFC"
              border="solid 1px #EBEBEB"
              borderRadius="md"
              boxShadow="base"
            >
              <Text color="gray">Tidak ada temuan</Text>
            </Center>
          )}
        </VStack>
        <PaginationNav
          searchParamsState={[searchParams, setSearchParams]}
          pages={data?.pages}
        />
      </VStack>
      <PaymentModal
        isOpen={isOpen}
        onClose={onClose}
        orderId={orderId}
        navigate={navigate}
      />
    </>
  );
};

export default OrdersPage;
