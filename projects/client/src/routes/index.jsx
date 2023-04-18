import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Grid,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
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
import { FaPlus } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";
import CategoryCardUser from "../components/CategoryCardUser";
import PaginationNumber from "../components/PaginationNumber";
import { axiosInstance } from "../config/config";

const IndexPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [categories, setCategories] = useState([]);
  const toast = useToast();
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [name, setName] = useState();
  const [tempName, setTempName] = useState();
  const [sortBy, setSortBy] = useState();
  const [tempSortBy, setTempSortBy] = useState();
  const [size, setSize] = useState();

  const options = [
    {
      label: "Terbaru",
      value: "latest",
    },
    {
      label: "Terlama",
      value: "oldest",
    },
  ];

  function filterQueryParams({ name, sortBy, page, size }) {
    let queryParams = "";
    const filteredParams = { name, sortBy, page, size };
    Object.keys(filteredParams)
      .filter(
        (key) => filteredParams[key] !== undefined && filteredParams[key] !== ""
      )
      .forEach((key, index) => {
        if (key === "name") {
          setFilterValue("Nama");
        }
        const prefix = index === 0 ? "?" : "&";
        queryParams += `${prefix}${key}=${encodeURIComponent(
          filteredParams[key]
        )}`;
      });
    return queryParams;
  }

  function applyFilter({ name, sortBy, page }) {
    let result = filterQueryParams({ name, sortBy, page });
    navigate(`/${result}`);
  }

  const handlePageChange = (page) => {
    applyFilter({ name, sortBy, page });
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!userSelector.id) {
      toast({
        position: "bottom-left",
        title: "Anda belum terverfikasi",
        description: "Silahkan login dengan mengklik tombol masuk",
        status: "info",
        duration: 8000,
        isClosable: true,
      });
    }
  }, []);

  useEffect(() => {
    if (filterValue !== "Nama") {
      setTempName("");
    }
  }, [filterValue]);

  useEffect(() => {
    async function fetchTotalPage({ name, size }) {
      try {
        const result = filterQueryParams({ name, size });
        const res = await axiosInstance.get(`/categories/v2${result}`, {
          withCredentials: true,
        });
        setTotalPages(res.data.totalPage);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalPage({ name, size });
  }, [name, size]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const { name, sortBy, page, size } = Object.fromEntries(
      queryParams.entries()
    );
    if (name !== undefined) {
      setName(name);
      setTempName(name);
    } else {
      setName("");
      setTempName("");
    }
    setCurrentPage(page);
    if (sortBy === undefined) {
      setSortBy("latest");
      setTempSortBy("latest");
    } else {
      setSortBy(sortBy);
      setTempSortBy(sortBy);
    }
    if (size !== undefined) {
      setSize(size);
    }
    setSize(size);
    async function fetchCategories({ name, sortBy, page, size }) {
      try {
        const result = filterQueryParams({ name, sortBy, page, size });
        const res = await axiosInstance.get(`/categories${result}`, {
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories({ name, sortBy, page, size });
  }, [location]);

  function TagName() {
    return <Tag>{name}</Tag>;
  }

  function TagSorting() {
    const sort = options.find((option) => {
      return option.value == sortBy;
    });
    return <Tag>{sort?.label}</Tag>;
  }

  return (
    <>
      <Carousel />
      <Box mb={"3"} mt={"10"} w={"full"}>
        <HStack>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button onClick={onOpen}>Tambah Filter</Button>
            <IconButton onClick={onOpen} icon={<FaPlus />} />
          </ButtonGroup>
          <Modal
            isCentered
            isOpen={isOpen}
            onClose={() => {
              setTempName(name);
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
                  colorScheme={"teal"}
                >
                  <HStack spacing="24px">
                    <Radio value="">Tidak Memfilter</Radio>
                    <Radio value="Nama">Nama</Radio>
                  </HStack>
                </RadioGroup>
              </ModalBody>
              {filterValue ? (
                <>
                  <ModalHeader>Pencarian</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<MdSearch />}
                      />
                      <Input
                        type="text"
                        placeholder="Cari Kategori"
                        value={tempName}
                        onChange={(e) => {
                          setTempName(e.target.value);
                        }}
                      />
                    </InputGroup>
                  </ModalBody>
                </>
              ) : null}
              <ModalHeader>Urutkan dengan</ModalHeader>
              <ModalBody>
                <RadioGroup
                  colorScheme={"teal"}
                  onChange={setTempSortBy}
                  defaultValue={tempSortBy}
                  value={tempSortBy}
                >
                  <HStack gap={"4"} flexWrap={"wrap"}>
                    {options.map((option, index) => {
                      return (
                        <Radio key={index} value={option.value}>
                          {option.label}
                        </Radio>
                      );
                    })}
                  </HStack>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  textColor={"white"}
                  fontWeight={"semibold"}
                  bgColor={"#009262"}
                  variant="solid"
                  onClick={() => {
                    applyFilter({
                      page: 1,
                      name: tempName,
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
          {name ? <TagName /> : null}
          {sortBy ? <TagSorting /> : null}
        </HStack>
      </Box>
      {categories.length ? (
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(5, 1fr)",
            "repeat(6, 1fr)",
            "repeat(7, 1fr)",
            "repeat(8, 1fr)",
          ]}
          gap={6}
          marginY={"5"}
        >
          {categories.map((category, index) => (
            <CategoryCardUser
              key={category.id}
              category={category}
              hue={index * (360 / 24)}
              saturation={50}
              lightness={60}
            />
          ))}
        </Grid>
      ) : (
        <Center marginY={"10"}>List Kategori tidak dapat ditemukan</Center>
      )}
      <Center>
        <PaginationNumber
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Center>
    </>
  );
};

export default IndexPage;
