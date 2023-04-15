import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPen,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import {
  Form,
  Link as RouterLink,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import FormGrid from "../../../components/FormGrid";
import SortButton from "../../../components/SortButton";
import PaginationNav from "../../../components/PaginationNav";

/** @type {import("react-router-dom").LoaderFunction} */
export const ProductCategoriesLoader = async ({ request }) => {
  try {
    const query = new URL(request.url).searchParams.toString();
    const res = await axios.get(
      `http://localhost:8000/api/v1/product-categories?${query}&take=10`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

/** @type {import("react-router-dom").ActionFunction} */
export const ProductCategoriesAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const newName = name !== formData.get("defaultName") && { name };
    const status = formData.get("status");
    const newStatus = status !== formData.get("defaultStatus") && { status };
    const res = await axios.put(
      `http://localhost:8000/api/v1/product-categories/${formData.get("id")}`,
      { ...newName, ...newStatus },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

const ProductCategoriesPage = () => {
  const [sort, setSort] = useState(["", ""]);
  const [entries, setEntries] = useState(null);
  const data = useLoaderData();
  const actionData = useActionData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <AdminProductsLayout heading="Kategori Produk">
      <Flex mb={5} justifyContent="flex-end">
        <InputGroup w={48} size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} />
          </InputLeftElement>
          <Input
            placeholder="Cari"
            onBlur={(e) => {
              setSearchParams((val) => {
                val.set("search", e.target.value);
                return val;
              });
            }}
          />
        </InputGroup>
        <Button
          as={RouterLink}
          to="add"
          leftIcon={<FaPlus />}
          fontSize="sm"
          ml={2}
          size="sm"
        >
          Kategori Baru
        </Button>
      </Flex>
      <TableContainer mb={5}>
        <Table border="solid 1px #EBEBEB" size="sm">
          <Thead bgColor="#009262">
            <Tr>
              <Th color="#FCFCFC" textAlign="center">
                <SortButton
                  sortState={[sort, setSort]}
                  setSearchParams={setSearchParams}
                  column="name"
                />
                Nama
              </Th>
              <Th color="#FCFCFC" textAlign="center">
                <SortButton
                  sortState={[sort, setSort]}
                  setSearchParams={setSearchParams}
                  column="products"
                />
                Produk
              </Th>
              <Th color="#FCFCFC" textAlign="center">
                <SortButton
                  sortState={[sort, setSort]}
                  setSearchParams={setSearchParams}
                  column="status"
                />
                Status
              </Th>
              <Th color="#FCFCFC" textAlign="center">
                Atur
              </Th>
            </Tr>
          </Thead>
          <Tbody bgColor="white">
            {data?.productCategories?.map((productCategory, idx) => (
              <Tr key={idx}>
                <Td textAlign="center">{productCategory.name}</Td>
                <Td textAlign="center">
                  {productCategory._count.products || "--"}
                </Td>
                <Td textAlign="center" color="#FCFCFC">
                  {productCategory.deletedAt ? (
                    <Text bgColor="#88939E">Arsip</Text>
                  ) : (
                    <Text bgColor="#009262">Terbit</Text>
                  )}
                </Td>
                <Td textAlign="center">
                  <IconButton
                    icon={<FaPen />}
                    aria-label="edit product category"
                    size="sm"
                    onClick={() => {
                      setEntries(productCategory);
                      onOpen();
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <PaginationNav
        searchParamsState={[searchParams, setSearchParams]}
        pages={data?.pages}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sunting Kategori Produk</ModalHeader>
          <ModalBody>
            <Box as={Form} id="edit-form" method="put">
              <FormGrid actionData={actionData} entries={entries} />
              <Input
                name="id"
                defaultValue={entries?.id}
                display="none"
                isReadOnly
              />
              <Input
                name="defaultName"
                defaultValue={entries?.name}
                display="none"
                isReadOnly
              />
              <Input
                name="defaultStatus"
                defaultValue={entries?.deletedAt ? "archived" : "published"}
                display="none"
                isReadOnly
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              color="#009262"
              borderColor="#009262"
              mr={5}
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="edit-form"
              isLoading={navigation.state === "loading"}
              bgColor="#009262"
              color="white"
            >
              Simpan Perubahan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminProductsLayout>
  );
};

export default ProductCategoriesPage;
