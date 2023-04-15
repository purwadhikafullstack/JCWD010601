import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import CardItem from "./CardItem";
import OrderStatusBadge from "./OrderStatusBadge";

const UserOrderCard = ({ order, handleOpen, handleCancel }) => {
  const { createdAt, shipmentPrice, status, details } = order;

  return (
    <Card
      bgColor="#FCFCFC"
      border="solid 1px #EBEBEB"
      size={{ base: "sm", lg: "md" }}
    >
      <CardHeader>
        <HStack spacing={5}>
          <Text fontWeight="bold">Belanja</Text>
          <Text color="#717171">
            {createdAt.split(".")[0].replace("T", " ")}
          </Text>
          <OrderStatusBadge status={status.toLowerCase()} />
        </HStack>
      </CardHeader>
      <CardBody>
        <Flex justifyContent="space-between">
          <VStack align="flex-start" mr={2}>
            <CardItem detail={details[0]} />
            <Accordion allowToggle>
              <AccordionItem border="none">
                <AccordionButton
                  color="#88939E"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  <Text as="span" flex={1} textAlign="start">
                    Lihat {details.length - 1} produk lainnya
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  {details.slice(1).map((detail, idx) => (
                    <CardItem key={idx} detail={detail} />
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
          <Center
            flexDir="column"
            borderLeft="solid 2px #EBEBEB"
            w={{ base: 32, lg: 48 }}
          >
            <Text fontWeight="semibold" color="#717171" whiteSpace="nowrap">
              Total Belanja
            </Text>
            <Text fontWeight="bold" fontSize="xl" color="#212121">
              Rp
              {(
                details.reduce(
                  (prev, { priceRupiahPerUnit, quantity }) =>
                    prev + priceRupiahPerUnit * quantity,
                  0
                ) + shipmentPrice
              ).toLocaleString("id")}
            </Text>
          </Center>
        </Flex>
      </CardBody>
      <CardFooter>
        {status === "UNSETTLED" && (
          <Flex justifyContent="flex-end" w="full">
            <Button variant="ghost" color="#009262" onClick={handleCancel}>
              Batal Pesanan
            </Button>
            <Button
              bgColor="#009262"
              color="#FCFCFC"
              w={{ lg: 56 }}
              ml={1}
              onClick={handleOpen}
            >
              Bayar Sekarang
            </Button>
          </Flex>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserOrderCard;
