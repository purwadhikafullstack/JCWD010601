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
  Image,
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
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import OrderCard from "../../../components/OrderCardAdmin";
import PaginationNumber from "../../../components/PaginationNumber";
import { axiosInstance } from "../../../config/config";

const AdminOrdersPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const cancelRef = useRef();
  const toast = useToast();
  const location = useLocation();
  const {
    isOpen: isOpenDialogFilter,
    onOpen: onOpenDialogFilter,
    onClose: onCloseDialogFilter,
  } = useDisclosure();
  const {
    isOpen: isOpenDialogCancel,
    onOpen: onOpenDialogCancel,
    onClose: onCloseDialogCancel,
  } = useDisclosure();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [productName, setProductName] = useState("");
  const [tempProductName, setTempProductName] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [tempWarehouseName, setTempWarehouseName] = useState("");
  const [sortBy, setSortBy] = useState();
  const [tempSortBy, setTempSortBy] = useState();
  const [status, setStatus] = useState();
  const [tempStatus, setTempStatus] = useState();
  const [size, setSize] = useState();
  const [isOpenProof, setIsOpenProof] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState();

  const sortOptions = [
    {
      label: "Terbaru",
      value: "latest",
    },
    {
      label: "Terlama",
      value: "oldest",
    },
  ];

  const statusOptions = [
    {
      label: "Menunggu Pembayaran",
      value: "UNSETTLED",
    },
    {
      label: "Menunggu Konfirmasi",
      value: "REQUESTED",
    },
    {
      label: "Dalam persiapan",
      value: "PREPARING",
    },
    {
      label: "Dalam proses pengiriman",
      value: "SENDING",
    },
    {
      label: "Diterima",
      value: "DELIVERED",
    },
    {
      label: "Dibatalkan",
      value: "CANCELLED",
    },
  ];

  const handleOpenProofModal = (imageUrl) => {
    setIsOpenProof(true);
    setModalImage(imageUrl);
  };

  const handleCloseProofModal = () => {
    setIsOpenProof(false);
    setModalImage("");
  };

  const cancelHandler = async () => {
    try {
      const res = await axiosInstance.post(
        `/orders/v3/${selectedOrder}`,
        null,
        {
          withCredentials: true,
        }
      );
      setSelectedOrder(null);
      onCloseDialogCancel();
      applyFilter({
        warehouseName,
        productName,
        page: 1,
        status,
        sortBy,
        size,
      });
      toast({
        position: "bottom-right",
        title: "Pembatalan Pesanan",
        description: "Pesanan berhasil dibatalkan",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        position: "bottom-right",
        title: "Pembatalan Pesanan",
        description: "Pesanan gagal dibatalkan",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    }
  };

  function applyFilter({
    warehouseName,
    productName,
    status,
    sortBy,
    page,
    size,
  }) {
    let queryParams = "";
    const filteredParams = {
      productName,
      warehouseName,
      status,
      sortBy,
      page,
      size,
    };
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
    navigate(`/admin/orders${queryParams}`);
  }

  const handlePageChange = (page) => {
    applyFilter({ warehouseName, productName, status, sortBy, page, size });
    setCurrentPage(page);
  };

  useEffect(() => {
    if (filterValue === "Produk") {
      setTempWarehouseName("");
      setTempProductName(productName);
    } else if (filterValue === "Warehouse") {
      setTempProductName("");
      setTempWarehouseName(warehouseName);
    } else {
      setTempProductName("");
      setTempWarehouseName("");
    }
  }, [filterValue]);

  useEffect(() => {
    async function fetchTotalPage(warehouseName, productName, status, size) {
      try {
        let queryParams = "";
        const filteredParams = { warehouseName, productName, status, size };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
          )
          .forEach((key, index) => {
            if (key === "warehouseName") {
              setFilterValue("Warehouse");
            } else if (key === "productName") {
              setFilterValue("Produk");
            }
            const prefix = index === 0 ? "?" : "&";
            queryParams += `${prefix}${key}=${encodeURIComponent(
              filteredParams[key]
            )}`;
          });

        const res = await axiosInstance.get(`/orders/v2${queryParams}`, {
          withCredentials: true,
        });
        setTotalPages(res.data.totalPage);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTotalPage(warehouseName, productName, status, size);
  }, [warehouseName, productName, status, size]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const { status, productName, sortBy, page, size, warehouseName } =
      Object.fromEntries(queryParams.entries());

    if (warehouseName !== undefined) {
      setWarehouseName(warehouseName);
      setTempWarehouseName(warehouseName);
    } else if (productName !== undefined) {
      setProductName(productName);
      setTempProductName(productName);
    }

    setCurrentPage(page);

    if (sortBy === undefined) {
      setSortBy("latest");
      setTempSortBy("latest");
    } else {
      setSortBy(sortBy);
      setTempSortBy(sortBy);
    }

    if (status === undefined) {
      setStatus("UNSETTLED");
      setTempStatus("UNSETTLED");
    } else {
      setStatus(status);
      setTempStatus(status);
    }

    if (size !== undefined) {
      setSize(size);
    }
    async function fetchOrders(
      warehouseName,
      productName,
      status,
      sortBy,
      page,
      size
    ) {
      try {
        let queryParams = "";
        const filteredParams = {
          warehouseName,
          productName,
          sortBy,
          status,
          page,
          size,
        };
        Object.keys(filteredParams)
          .filter(
            (key) =>
              filteredParams[key] !== undefined && filteredParams[key] !== ""
          )
          .forEach((key, index) => {
            if (key === "productName") {
              setFilterValue("Produk");
            } else if (key === "warehouseName") {
              setFilterValue("Warehouse");
            }
            const prefix = index === 0 ? "?" : "&";
            queryParams += `${prefix}${key}=${encodeURIComponent(
              filteredParams[key]
            )}`;
          });

        const res = await axiosInstance.get(`/orders${queryParams}`, {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders(warehouseName, productName, status, sortBy, page, size);
  }, [location.search]);

  function TagWarehouseName() {
    return (
      <Tag>
        Nama Warehouse -{`>`} {warehouseName}
      </Tag>
    );
  }

  function TagProductName() {
    return (
      <Tag>
        Nama Produk -{`>`} {productName}
      </Tag>
    );
  }

  function TagSorting() {
    const sort = sortOptions.find((option) => {
      return option.value == sortBy;
    });
    return <Tag>{sort?.label}</Tag>;
  }

  function TagStatus() {
    const sort = statusOptions.find((option) => {
      return option.value == status;
    });
    return <Tag>{sort?.label}</Tag>;
  }

  return (
    <Box px={8} flex={1} overflowY="auto">
      <Heading py={7}>Pesanan</Heading>
      <Box mb={3} w={"full"}>
        <HStack>
          <ButtonGroup size="sm" isAttached variant="outline" bg={"white"}>
            <Button onClick={onOpenDialogFilter}>Tambah Filter</Button>
            <IconButton onClick={onOpenDialogFilter} icon={<FaPlus />} />
          </ButtonGroup>
          <Modal
            isCentered
            isOpen={isOpenDialogFilter}
            onClose={() => {
              if (warehouseName) {
                setTempWarehouseName(warehouseName);
              } else if (productName) {
                setTempProductName(productName);
              }
              setTempStatus(status);
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
                  <HStack gap={"4"} flexWrap={"wrap"}>
                    <Radio value="" colorScheme={"teal"}>
                      Tidak diterapkan
                    </Radio>
                    <Radio value="Produk" colorScheme={"teal"}>
                      Produk
                    </Radio>
                    <Radio
                      value="Warehouse"
                      colorScheme={"teal"}
                      isDisabled={userSelector.role !== "ADMIN"}
                    >
                      Warehouse
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
                        placeholder={`Cari berdasarkan ${filterValue}`}
                        value={
                          filterValue === "Warehouse"
                            ? tempWarehouseName
                            : filterValue === "Produk"
                            ? tempProductName
                            : ""
                        }
                        onChange={(e) => {
                          if (filterValue === "Warehouse") {
                            setTempWarehouseName(e.target.value);
                          } else if (filterValue === "Produk") {
                            setTempProductName(e.target.value);
                          }
                        }}
                      />
                    </InputGroup>
                  </ModalBody>
                </>
              ) : null}
              <ModalHeader>Status pesanan</ModalHeader>
              <ModalBody>
                <RadioGroup
                  onChange={setTempStatus}
                  defaultValue={tempStatus}
                  value={tempStatus}
                >
                  <HStack gap={"3"} flexWrap={"wrap"}>
                    {statusOptions.map((option, index) => {
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
              <ModalHeader>Urutkan dengan</ModalHeader>
              <ModalBody>
                <RadioGroup
                  onChange={setTempSortBy}
                  defaultValue={tempSortBy}
                  value={tempSortBy}
                >
                  <HStack gap={"4"} flexWrap={"wrap"}>
                    {sortOptions.map((option, index) => {
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
                    if (tempWarehouseName === "") {
                      setWarehouseName("");
                    } else if (tempProductName === "") {
                      setProductName("");
                    }
                    applyFilter({
                      page: 1,
                      warehouseName: tempWarehouseName ?? "",
                      productName: tempProductName ?? "",
                      status: tempStatus,
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
          {status ? <TagStatus /> : null}
          {warehouseName ? (
            <TagWarehouseName />
          ) : productName ? (
            <TagProductName />
          ) : null}
        </HStack>
      </Box>
      {orders.length ? (
        <VStack gap={"3"} w={"full"} alignItems={"stretch"}>
          {orders.map((order) => {
            return (
              <OrderCard
                key={order.id}
                order={order}
                onOpenProofModal={() =>
                  handleOpenProofModal(order.paymentImageUrl)
                }
                onOpenDialogCancel={() => {
                  onOpenDialogCancel();
                  setSelectedOrder(order.id);
                }}
              />
            );
          })}
        </VStack>
      ) : (
        <Center h={"80vh"} bg={"white"} fontWeight={"bold"}>
          Pesanan tidak ditemukan
        </Center>
      )}
      <Center mb={"5"}>
        <PaginationNumber
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Center>
      <Modal isOpen={isOpenProof} onClose={handleCloseProofModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bukti Pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image
                maxHeight="75vh"
                src={modalImage}
                alt="Gambar Bukti Pembayaran"
              />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onCloseDialogCancel}
        isOpen={isOpenDialogCancel}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Batalkan Pesanan</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Apakah Anda yakin ingin membatalkan pesanan?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant={"outline"}
              colorScheme={"teal"}
              ref={cancelRef}
              onClick={onCloseDialogCancel}
            >
              Nanti Saja
            </Button>
            <Button
              ml={3}
              bgColor={"#009262"}
              textColor={"white"}
              onClick={cancelHandler}
            >
              Ya, Batalkan
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};
export default AdminOrdersPage;
