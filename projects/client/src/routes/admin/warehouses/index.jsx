import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
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
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { axiosInstance } from "../../../config/config";
import PaginationNumber from "../../../components/PaginationNumber";

const WarehousePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cancelRef = useRef();
  const {
    isOpen: isOpenDialogDelete,
    onOpen: onOpenDialogDelete,
    onClose: onCloseDialogDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenDialogFilter,
    onOpen: onOpenDialogFilter,
    onClose: onCloseDialogFilter,
  } = useDisclosure();
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
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

  const deleteHandler = async () => {
    try {
      await axiosInstance.delete(`/warehouses/v1/${selectedWarehouse?.id}`, {
        withCredentials: true,
      });
      setSelectedWarehouse(null);
      onClose();
      applyFilter({ name, page: 1, sortBy, size });
    } catch (error) {
      console.error(error);
    }
  };

  function applyFilter({ name, page, sortBy, size }) {
    const filteredParams = filterQueryParams({ name, sortBy, page, size });
    navigate(`/admin/warehouses${filteredParams}`);
  }

  const handlePageChange = (page) => {
    applyFilter({ name, page, sortBy, size });
    setCurrentPage(page);
  };

  useEffect(() => {
    async function fetchTotalPage(name, size) {
      try {
        const filteredParams = filterQueryParams({ name, size });
        const res = await axiosInstance.get(`/warehouses/v3${filteredParams}`, {
          withCredentials: true,
        });
        setTotalPages(res.data.totalPage);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalPage(name, size);
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
    async function fetchWarehouses(name, sortBy, page, size) {
      try {
        const filteredParams = filterQueryParams({ name, sortBy, page, size });
        const res = await axiosInstance.get(`/warehouses${filteredParams}`, {
          withCredentials: true,
        });
        setWarehouses(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchWarehouses(name, sortBy, page, size);
  }, [location]);

  function TagName() {
    return (
      <Tag>
        Nilai Pencarian -{`>`} {name}
      </Tag>
    );
  }

  function TagSorting() {
    const sort = options.find((option) => {
      return option.value == sortBy;
    });
    return <Tag>{sort?.label}</Tag>;
  }

  return (
    <Box px={8} flex={1} overflowY="auto">
      <Heading py={7}>Warehouse</Heading>
      <HStack w={"full"} justifyContent={"space-between"} mb={3}>
        <Box>
          <HStack>
            <ButtonGroup size="sm" isAttached variant="outline" bg={"white"}>
              <Button onClick={onOpenDialogFilter}>Tambah Filter</Button>
              <IconButton onClick={onOpenDialogFilter} icon={<FaPlus />} />
            </ButtonGroup>
            <Modal
              isCentered
              isOpen={isOpenDialogFilter}
              onClose={() => {
                setTempName(name);
                setTempSortBy(sortBy);
                onCloseDialogFilter();
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
                      <Radio value="" colorScheme={"teal"}>
                        Tidak Memfilter
                      </Radio>
                      <Radio value="Nama" colorScheme={"teal"}>
                        Nama
                      </Radio>
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
                          placeholder="Cari Warehouse"
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
                    onChange={setTempSortBy}
                    defaultValue={tempSortBy}
                    value={tempSortBy}
                  >
                    <HStack gap={"4"} flexWrap={"wrap"}>
                      {options.map((option, index) => {
                        return (
                          <Radio
                            key={index}
                            value={option.value}
                            colorScheme={"teal"}
                          >
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
                    onClick={() => {
                      applyFilter({
                        page: 1,
                        name: tempName,
                        sortBy: tempSortBy,
                      });
                      setCurrentPage(1);
                      onCloseDialogFilter();
                    }}
                  >
                    Terapkan
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {sortBy ? <TagSorting /> : null}
            {name ? <TagName /> : null}
          </HStack>
        </Box>
        <ButtonGroup size="sm" isAttached variant="outline" bg={"white"}>
          <IconButton
            icon={<FaPlus />}
            onClick={() => {
              navigate("/admin/warehouses/create");
            }}
          />
          <Button
            onClick={() => {
              navigate("/admin/warehouses/create");
            }}
          >
            Warehouse
          </Button>
        </ButtonGroup>
      </HStack>
      {!warehouses ? (
        <Center w={"full"} h={"50vh"}>
          <Heading size={"md"}>Data warehouse tidak ditemukan.</Heading>
        </Center>
      ) : (
        <>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={"white"}
          >
            <Table>
              <Thead>
                <Tr bg={"#009262"}>
                  <Th textColor={"white"}>Nama Warehouse</Th>
                  <Th textColor={"white"}>Email Manager</Th>
                  <Th textColor={"white"}>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {warehouses
                  ? warehouses.map((warehouse) => (
                      <Tr key={warehouse.id}>
                        <Td>{warehouse.name}</Td>
                        <Td>{warehouse.manager.email}</Td>
                        <Td>
                          <IconButton
                            icon={<MdEdit />}
                            aria-label="Edit"
                            size="md"
                            mr="2"
                            onClick={() => {
                              navigate(
                                `/admin/warehouses/update/${warehouse.id}`
                              );
                            }}
                          />
                          <IconButton
                            icon={<MdDelete />}
                            aria-label="Delete"
                            size="md"
                            onClick={() => {
                              onOpenDialogDelete();
                              setSelectedWarehouse({
                                id: warehouse.id,
                                name: warehouse.name,
                              });
                            }}
                          />
                        </Td>
                      </Tr>
                    ))
                  : null}
              </Tbody>
            </Table>
          </Box>
          <Center w={"full"}>
            <PaginationNumber
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Center>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onCloseDialogDelete}
            isOpen={isOpenDialogDelete}
            isCentered
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Hapus Warehouse</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Apakah Anda yakin ingin menghapus {selectedWarehouse?.name}?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant={"outline"}
                  colorScheme={"teal"}
                  ref={cancelRef}
                  onClick={onCloseDialogDelete}
                >
                  Nanti Saja
                </Button>
                <Button
                  ml={3}
                  bgColor={"#009262"}
                  textColor={"white"}
                  onClick={deleteHandler}
                >
                  Ya, Hapus
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </Box>
  );
};

export default WarehousePage;
