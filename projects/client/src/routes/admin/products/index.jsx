import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaImage,
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
export const ProductsLoader = async ({ request }) => {
  try {
    const query = new URL(request.url).searchParams.toString();
    const res = await axios.get(
      `http://localhost:8000/api/v1/products?${query}&take=10`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

/** @type {import("react-router-dom").ActionFunction} */
export const ProductsAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const res = await axios.put(
      `http://localhost:8000/api/v1/products/${formData.get("defaultId")}`,
      Object.assign(
        {},
        ...[
          "name",
          "category",
          "description",
          "priceRupiahPerUnit",
          "image",
          "status",
        ].map((key) => {
          const value = formData.get(key);
          const newValue = value &&
            JSON.stringify(value) !==
              JSON.stringify(
                formData.get(
                  `default${key.charAt(0).toUpperCase()}${key.slice(1)}`
                )
              ) && { [key]: value };
          return newValue;
        })
      ),
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

const ProductsPage = () => {
  const [sort, setSort] = useState(["", ""]);
  const [entries, setEntries] = useState(null);
  const [productCategories, setProductCategories] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const data = useLoaderData();
  const actionData = useActionData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/product-categories",
          { withCredentials: true }
        );
        setProductCategories(res.data.productCategories);
      } catch (err) {
        alert(JSON.stringify(err.response.data));
      }
    })();
  }, []);

  useEffect(() => {
    if (!isOpen && preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [isOpen, preview]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    if (selected) {
      if (selected.size > 1000000) {
        alert("Ukuran foto melebihi batas 1MB");
      } else {
        return setPreview(URL.createObjectURL(selected));
      }
    }
    setPreview(null);
  };

  return (
    <AdminProductsLayout heading="Produk">
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
          Produk Baru
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
                  column="category"
                />
                Category
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
            {data?.products?.map((product, idx) => (
              <Tr key={idx}>
                <Td textAlign="center">{product.name}</Td>
                <Td textAlign="center">{product.category.name}</Td>
                <Td textAlign="center" color="#FCFCFC">
                  {product.deletedAt ? (
                    <Text bgColor="#88939E">Arsip</Text>
                  ) : (
                    <Text bgColor="#009262">Terbit</Text>
                  )}
                </Td>
                <Td textAlign="center">
                  <IconButton
                    icon={<FaPen />}
                    aria-label="edit product"
                    size="sm"
                    onClick={() => {
                      setEntries(product);
                      setPreview(
                        `http://localhost:8000/products/${product.imageUrl}`
                      );
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
          <ModalHeader>Sunting Produk</ModalHeader>
          <ModalBody>
            <Box
              as={Form}
              id="edit-form"
              method="put"
              encType="multipart/form-data"
            >
              <FormGrid actionData={actionData} entries={entries}>
                <FormControl
                  isInvalid={actionData?.errors?.category}
                  isRequired
                >
                  <FormLabel htmlFor="category">Kategori</FormLabel>
                </FormControl>
                <FormControl
                  isInvalid={actionData?.errors?.category}
                  isRequired
                >
                  <Select
                    id="category"
                    name="category"
                    defaultValue={entries?.categoryId}
                  >
                    {productCategories?.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  isInvalid={actionData?.errors?.description}
                  isRequired
                >
                  <FormLabel htmlFor="description">Deskripsi</FormLabel>
                </FormControl>
                <FormControl
                  isInvalid={actionData?.errors?.description}
                  isRequired
                >
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={entries?.description}
                  />
                </FormControl>
                <FormControl
                  isInvalid={actionData?.errors?.priceRupiahPerUnit}
                  isRequired
                >
                  <FormLabel htmlFor="priceRupiahPerUnit">
                    Harga Rupiah
                  </FormLabel>
                </FormControl>
                <FormControl
                  isInvalid={actionData?.errors?.priceRupiahPerUnit}
                  isRequired
                >
                  <NumberInput
                    id="priceRupiahPerUnit"
                    name="priceRupiahPerUnit"
                    precision={0}
                    defaultValue={entries?.priceRupiahPerUnit}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="image">Foto</FormLabel>
                  <FormHelperText>JPEG/PNG di bawah 1MB</FormHelperText>
                </FormControl>
                <FormControl isRequired>
                  <Flex>
                    <Center
                      w={24}
                      h={24}
                      border="dashed 1px rgba(113, 113, 113, 0.5)"
                      borderRadius="4px"
                      onClick={() => {
                        inputRef.current.value = null;
                        inputRef.current.click();
                      }}
                    >
                      {preview ? (
                        <Image src={preview} alt="product image" />
                      ) : (
                        <Icon
                          as={FaImage}
                          boxSize={10}
                          color="rgba(113, 113, 113, 0.5)"
                        />
                      )}
                    </Center>
                    <Input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/png, image/jpeg"
                      h="0"
                      w="0"
                      opacity="0"
                      ref={inputRef}
                      onChange={handleChange}
                    />
                  </Flex>
                </FormControl>
              </FormGrid>
              {[
                { name: "defaultId", defaultValue: entries?.id },
                { name: "defaultName", defaultValue: entries?.name },
                { name: "defaultCategory", defaultValue: entries?.categoryId },
                {
                  name: "defaultDescription",
                  defaultValue: entries?.description,
                },
                {
                  name: "defaultPriceRupiahPerUnit",
                  defaultValue: entries?.priceRupiahPerUnit,
                },
                {
                  name: "defaultImage",
                  defaultValue: entries?.image,
                },
                {
                  name: "defaultStatus",
                  defaultValue: entries?.deletedAt ? "archived" : "published",
                },
              ].map(({ name, defaultValue }) => (
                <Input
                  key={name}
                  name={name}
                  defaultValue={defaultValue}
                  display="none"
                  isReadOnly
                />
              ))}
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

export default ProductsPage;
