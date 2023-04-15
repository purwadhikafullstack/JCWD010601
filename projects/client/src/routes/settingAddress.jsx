import {
  Box,
  Button,
  ButtonGroup,
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
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import AddressCard from "../components/AddressCard";
import { MdSearch } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import PaginationNumber from "../components/PaginationNumber";

const SettingAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");
  const [addresses, setAddresses] = useState([]);
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

  function applyFilter({ page, name, sortBy }) {
    let queryParams = "";
    const filteredParams = { name, sortBy, page, size };
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
    navigate(`/settings/address${queryParams}`);
  }

  const handlePageChange = (page) => {
    applyFilter({ page, name, sortBy });
    setCurrentPage(page);
  };

  useEffect(() => {
    if (filterValue !== "Nama") {
      setTempName("");
    }
  }, [filterValue]);

  useEffect(() => {
    async function fetchTotalPage(name, size) {
      try {
        let queryParams = "";
        const filteredParams = { name, size };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
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

        const res = await axiosInstance.get(`/address/v1${queryParams}`, {
          withCredentials: true,
        });
        setTotalPages(res.data.totalPage);
      } catch (error) {}
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
    async function fetchAddresses() {
      try {
        let queryParams = "";
        const filteredParams = { name, sortBy, page, size };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
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

        const res = await axiosInstance.get(`/address${queryParams}`, {
          withCredentials: true,
        });
        setAddresses(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAddresses();
  }, [location.search]);

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
      <Heading>Pengaturan</Heading>
      <Tabs isFitted defaultIndex={1}>
        <TabList>
          <Tab
            onClick={() => {
              navigate("/settings");
            }}
          >
            Profil
          </Tab>
          <Tab
            onClick={() => {
              navigate("/settings/address");
            }}
          >
            Alamat
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel></TabPanel>
          <TabPanel>
            <Box
              h={"full"}
              p={"4"}
              mx="auto"
              maxW="md"
              boxShadow="0 8px 16px rgba(171, 190, 209, 0.4)"
              borderRadius="10px"
            >
              {
                <VStack w={"full"}>
                  <HStack w={"full"}>
                    <Box>
                      <Heading fontSize="3xl" mb={2}>
                        Daftar Alamat
                      </Heading>
                    </Box>
                    <Spacer />
                    <Box
                      onClick={() => {
                        navigate("/settings/address/create");
                      }}
                    >
                      <Heading fontSize="sm" textColor={"green.400"} mb={2}>
                        Tambah alamat
                      </Heading>
                    </Box>
                  </HStack>
                  <Box mb={3} w={"full"}>
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
                                    placeholder="Cari Alamat"
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
                              colorScheme="blue"
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
                  {addresses.length ? (
                    <VStack w={"full"}>
                      {addresses.map((address) => {
                        return (
                          <AddressCard key={address.id} address={address} />
                        );
                      })}
                    </VStack>
                  ) : null}
                  <PaginationNumber
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </VStack>
              }
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SettingAddressPage;
