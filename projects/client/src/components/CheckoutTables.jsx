import {
  Avatar,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CheckoutTables = ({ products, shipmentPrice, formatPrice }) => {
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    setSubTotal(
      products?.reduce(
        (prev, { priceRupiahPerUnit, quantity }) =>
          prev + priceRupiahPerUnit * quantity,
        0
      )
    );
  }, [products]);

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Gambar</Th>
              <Th>Nama</Th>
              <Th isNumeric>Harga</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.map(
              ({ id, name, imageUrl, priceRupiahPerUnit, quantity }) => (
                <Tr key={id}>
                  <Td>
                    <Avatar
                      src={`http://localhost:8000/products/${imageUrl}`}
                      name={name}
                      borderRadius="10px"
                      size={{ base: "lg", lg: "xl" }}
                      border="solid #717171 1px"
                    />
                  </Td>
                  <Td fontWeight="bold">{`${name} x${quantity}`}</Td>
                  <Td fontWeight="semibold" isNumeric>
                    {formatPrice(priceRupiahPerUnit * quantity)}
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table>
          <Tbody>
            <Tr>
              <Td color="#717171" fontWeight="semibold">
                Subtotal
              </Td>
              <Td fontWeight="bold" isNumeric>
                {formatPrice(subTotal)}
              </Td>
            </Tr>
            <Tr>
              <Td color="#717171" fontWeight="semibold">
                Ongkir
              </Td>
              {shipmentPrice ? (
                <Td fontWeight="bold" isNumeric>
                  {formatPrice(shipmentPrice)}
                </Td>
              ) : (
                <Td fontWeight="light" isNumeric>
                  Pilih metode pengiriman
                </Td>
              )}
            </Tr>
            <Tr>
              <Td fontWeight="bold">Total</Td>
              <Td fontWeight="bold" isNumeric>
                {subTotal &&
                  shipmentPrice &&
                  formatPrice(subTotal + shipmentPrice)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CheckoutTables;
