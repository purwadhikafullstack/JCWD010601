import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Tag,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProductCardUser from "../components/ProductCardUser";
import { FaPlus } from "react-icons/fa";
import { axiosInstance } from "../config/config";
import PaginationProductUser from "../components/PaginationProductUser";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductsPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(2);
  const [name, setName] = useState();
  const [categoryId, setCategoryId] = useState();
  const [tempCategoryId, setTempCategoryId] = useState();
  const [tempSortBy, setTempSortBy] = useState();
  const [sortBy, setSortBy] = useState();
  const [size, setSize] = useState();
  const [categories, setCategories] = useState([]);

  const options = [
    {
      label: "Produk Terbaru",
      value: "latest",
    },
    {
      label: "Harga Tertinggi",
      value: "highest",
    },
    {
      label: "Harga Terendah",
      value: "lowest",
    },
  ];

  const handlePageChange = (page) => {
    applyFilter({ page, categoryId, sortBy });
    setCurrentPage(page);
  };

  function applyFilter({ page, categoryId, sortBy }) {
    let queryParams = "";
    const filteredParams = { name, categoryId, sortBy, page, size };
    Object.keys(filteredParams)
      .filter(
        (key) => filteredParams[key] !== undefined && filteredParams[key] !== ""
      )
      .forEach((key, index) => {
        const prefix = index === 0 ? "?" : "&";
        queryParams += `${prefix}${key}=${encodeURIComponent(
          filteredParams[key]
        )}`;
      });
    navigate(`/products${queryParams}`);
  }

  async function fetchCategories() {
    try {
      const res = await axiosInstance.get(`/categories?size=9999`, {
        withCredentials: true,
      });
      setCategories(res.data);
    } catch (error) {}
  }

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

    fetchCategories();
  }, []);

  useEffect(() => {
    if (filterValue !== "Kategori") {
      setTempCategoryId("");
    }
  }, [filterValue]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const { name, categoryId, sortBy, page, size } = Object.fromEntries(
      queryParams.entries()
    );
    setName(name);
    setCurrentPage(page);
    setCategoryId(categoryId);
    setTempCategoryId(categoryId);
    if (sortBy === undefined) {
      setSortBy("latest");
      setTempSortBy("latest");
    } else {
      setSortBy(sortBy);
      setTempSortBy(sortBy);
    }
    setSize(size);
    async function fetchProducts({ page, name, categoryId, sortBy, size }) {
      try {
        let queryParams = "";
        const filteredParams = { name, categoryId, sortBy, page, size };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
          )
          .forEach((key, index) => {
            if (key === "categoryId") {
              setFilterValue("Kategori");
            }
            const prefix = index === 0 ? "?" : "&";
            queryParams += `${prefix}${key}=${encodeURIComponent(
              filteredParams[key]
            )}`;
          });
        const res = await axiosInstance.get(`/products${queryParams}`, {
          withCredentials: true,
        });
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userSelector.id) {
      fetchProducts({ page, name, categoryId, sortBy, size });
    } else {
      fetchProducts({ page, categoryId });
    }
  }, [location]);

  useEffect(() => {
    async function fetchTotalPage() {
      try {
        let queryParams = "";
        const filteredParams = { name, categoryId, size };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
          )
          .forEach((key, index) => {
            if (key === "categoryId") {
              setFilterValue("Kategori");
            }
            const prefix = index === 0 ? "?" : "&";
            queryParams += `${prefix}${key}=${encodeURIComponent(
              filteredParams[key]
            )}`;
          });
        const res = await axiosInstance.get(`/products/v2${queryParams}`, {
          withCredentials: true,
        });
        setTotalPages(res.data.totalPage);
      } catch (error) {}
    }
    fetchTotalPage();
  }, [name, categoryId, size]);

  function TagCategory() {
    const category = categories.find((category) => {
      return category.id == categoryId;
    });
    return <Tag>{category?.name}</Tag>;
  }

  function TagSorting() {
    const sort = options.find((option) => {
      return option.value == sortBy;
    });
    return <Tag>{sort?.label}</Tag>;
  }

  const showCommonToast = () => {
    toast({
      position: "bottom-left",
      title: "Anda belum terverfikasi",
      description: "Silahkan login agar dapat menggunakan fitur tersebut",
      status: "info",
      duration: 8000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box mb={3}>
        <HStack>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              onClick={() => {
                if (userSelector.id) {
                  onOpen();
                } else {
                  showCommonToast();
                }
              }}
            >
              Tambah Filter
            </Button>
            <IconButton
              onClick={() => {
                if (userSelector.id) {
                  onOpen();
                } else {
                  showCommonToast();
                }
              }}
              icon={<FaPlus />}
            />
          </ButtonGroup>
          <Modal
            isCentered
            isOpen={isOpen}
            onClose={() => {
              setTempCategoryId(categoryId);
              setTempSortBy(sortBy);
              onClose();
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Filter dengan</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <RadioGroup
                  onChange={setFilterValue}
                  defaultValue={filterValue}
                >
                  <HStack spacing="24px">
                    <Radio value="">Tidak Memfilter</Radio>
                    <Radio value="Kategori">Kategori</Radio>
                  </HStack>
                </RadioGroup>
              </ModalBody>
              {filterValue && categories ? (
                <>
                  <ModalHeader>Pilih kategori</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <RadioGroup
                      onChange={setTempCategoryId}
                      value={tempCategoryId}
                    >
                      <Flex gap={"4"} flexWrap={"wrap"}>
                        {categories.map((category) => {
                          return (
                            <Radio
                              key={category.id}
                              value={category.id.toString()}
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {category.name}
                            </Radio>
                          );
                        })}
                      </Flex>
                    </RadioGroup>
                  </ModalBody>
                </>
              ) : null}
              <ModalHeader>Urutkan dengan</ModalHeader>
              <ModalBody>
                <RadioGroup
                  onChange={setTempSortBy}
                  defaultValue={tempSortBy}
                  value={tempSortBy}
                >
                  <Flex gap={"4"} flexWrap={"wrap"}>
                    {options.map((option, index) => {
                      return (
                        <Radio key={index} value={option.value}>
                          {option.label}
                        </Radio>
                      );
                    })}
                  </Flex>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => {
                    applyFilter({
                      page: 1,
                      categoryId: tempCategoryId,
                      sortBy: tempSortBy,
                    });
                    setCurrentPage(1);
                    onClose();
                  }}
                >
                  Terapkan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {categories && categoryId ? <TagCategory /> : null}
          {sortBy ? <TagSorting /> : null}
        </HStack>
      </Box>

      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(5, 1fr)",
        ]}
        gap={6}
        mb={3}
      >
        {products.map((product) => {
          return <ProductCardUser key={product.id} product={product} />;
        })}
      </Grid>
      <Center>
        <PaginationProductUser
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Center>
    </>
  );
};

export default ProductsPage;
