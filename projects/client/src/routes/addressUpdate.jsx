import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Icon,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Switch,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdArrowBack, MdLocationOn } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { axiosInstance } from "../config/config";

const AddressUpdatePage = () => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const markerRef = useRef(null);
  const [provinces, setProvinces] = useState([]);
  const [citys, setCitys] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(0);
  const [selectedCity, setSelectedCity] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);

  const formik = useFormik({
    initialValues: {
      province: "",
      city: "",
      street: "",
      detail: "",
      latitude: 0,
      longitude: 0,
      main: false,
    },
    validationSchema: Yup.object().shape({
      province: Yup.string().required("Provinsi tidak boleh kosong"),
      city: Yup.string().required("Kota/Kabupaten tidak boleh kosong"),
      street: Yup.string().required("Jalan tidak boleh kosong"),
      detail: Yup.string().required("Keterangan tidak boleh kosong"),
    }),
    onSubmit: () => {
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${formik.values.latitude}&lon=${formik.values.longitude}&accept-language=id`
        )
        .then((res) => {
          axiosInstance
            .put(
              `/address/${routeParams.id}`,
              {
                ...formik.values,
                postalCode: res.data.address.postcode,
              },
              { withCredentials: true }
            )
            .then((res) => {
              navigate("/settings/address");
            })
            .catch((_) => {
              throw new Error("Gagal membuat address");
            });
        })
        .catch((error) => {
          setStatus(true);
          setMsg(error.message);
        });
    },
  });

  async function fetchPosition(province_name, city_name, street) {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/?addressdetails=1&street=${street}&city=${city_name}&country=Indonesia&state=${province_name}&format=json&limit=1`
      );
      if (res.data.length) {
        formik.setFieldValue(
          "street",
          res.data[0]?.address.road ?? formik.values.street
        );
        formik.setFieldValue("latitude", res.data[0]?.lat);
        formik.setFieldValue("longitude", res.data[0]?.lon);
      } else {
        throw new Error("Titik lokasi tidak dapat ditemukan");
      }
    } catch (error) {
      console.error(error);
      setStatus(true);
      setMsg(error.message);
    }
  }

  async function fetchCitys(province_id) {
    try {
      const res = await axiosInstance.get(
        `/address/v1/city?province=${province_id}`
      );
      if (res.status === 200) {
        const listCity = await res.data.results.map((data) => {
          return { id: data.city_id, name: data.city_name };
        });
        setCitys(listCity);
      }
    } catch (error) {
      console.error(error);
      setStatus(true);
      setMsg("Daftar Kota/Kabupaten gagal dimuat.");
    }
  }

  async function deleteHandler() {
    try {
      const res = await axiosInstance.delete(`/address/${routeParams.id}`, {
        withCredentials: true,
      });
      navigate("/settings/address");
    } catch (error) {
      console.error(error);
    }
  }

  function Delete() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    return (
      <>
        <Button
          onClick={onOpen}
          colorScheme={"teal"}
          variant="outline"
          fontWeight={"medium"}
          isDisabled={selectedCity ? false : true}
        >
          Hapus
        </Button>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Hapus Alamat</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus alamat ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                variant={"outline"}
                colorScheme={"teal"}
                ref={cancelRef}
                onClick={onClose}
              >
                Nanti Saja
              </Button>
              <Button
                ml={3}
                bgColor={"#009262"}
                textColor={"white"}
                onClick={() => {
                  deleteHandler();
                }}
              >
                Ya, Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          formik.setFieldValue("latitude", marker.getLatLng().lat);
          formik.setFieldValue("longitude", marker.getLatLng().lng);
          setStatus(false);
          setMsg("");
        }
      },
    }),
    []
  );

  useEffect(() => {
    async function fetchAddress(id) {
      try {
        const res = await axiosInstance.get(`/address/v3/${id}`, {
          withCredentials: true,
        });
        try {
          const responseProvinces = await axiosInstance.get(
            "/address/v1/province"
          );
          const listProvince = await responseProvinces.data.results.map(
            (data) => {
              return { id: data.province_id, name: data.province };
            }
          );
          setProvinces(listProvince);
          let currentProvinceId = 0;
          await responseProvinces.data.results.map(async (data) => {
            if (data.province === res.data.province) {
              setSelectedProvince(data.province_id);
              currentProvinceId = data.province_id;
            }
          });
          try {
            const responseCity = await axiosInstance.get(
              `/address/v1/city?province=${currentProvinceId}`
            );
            const listCity = await responseCity.data.results.map((data) => {
              return { id: data.city_id, name: data.city_name };
            });
            setCitys(listCity);
            responseCity.data.results.map((data, index) => {
              if (data.city_name === res.data.city) {
                setSelectedCity(index + 1);
              }
            });
          } catch (error) {
            throw new Error("Daftar Kota/Kabupaten gagal dimuat.");
          }
        } catch (error) {
          throw new Error("Daftar Provinsi gagal dimuat.");
        }
        formik.setFieldValue("province", res.data.province);
        formik.setFieldValue("city", res.data.city);
        formik.setFieldValue("detail", res.data.detail);
        formik.setFieldValue("street", res.data.street);
        formik.setFieldValue("latitude", res.data.latitude);
        formik.setFieldValue("longitude", res.data.longitude);
        formik.setFieldValue("main", res.data.main);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMsg(error.message);
      }
    }
    fetchAddress(routeParams.id);
  }, []);

  useEffect(() => {
    setCitys([]);
    setSelectedCity(0);
    if (selectedProvince) {
      fetchCitys(provinces[selectedProvince - 1]?.id);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (formik.values.province && formik.values.city && formik.values.street) {
      fetchPosition(formik.values.province, formik.values.street);
      setShowMap(true);
    }
  }, [showMap]);

  return (
    <VStack w={"full"}>
      <HStack w={"full"} justifyContent={"space-between"} mb={5}>
        <Icon
          as={MdArrowBack}
          boxSize={8}
          onClick={() => {
            navigate("/settings/address");
          }}
        />
        <Heading fontSize="3xl">Edit Alamat</Heading>
        <Icon as={MdArrowBack} boxSize={8} color="white" />
      </HStack>
      <FormControl>
        <FormLabel>Provinsi</FormLabel>
        <Select
          placeholder="Pilih Provinsi"
          bgColor="#F1FBF8"
          value={selectedProvince ? selectedProvince : 0}
          onChange={(e) => {
            formik.setFieldValue("latitude", 0);
            formik.setFieldValue("longitude", 0);
            formik.setFieldValue(
              "province",
              provinces[e.target.value - 1]?.name
            );
            setSelectedProvince(e.target.value);
            setStatus(false);
            setShowMap(false);
          }}
        >
          {provinces.map((province, index) => {
            return (
              <option key={province.id} value={index + 1}>
                {province.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Kota/Kabupaten</FormLabel>
        <Select
          placeholder="Pilih Kota/Kabupaten"
          bgColor="#F1FBF8"
          value={selectedCity ? selectedCity : 0}
          onChange={(e) => {
            setStatus(false);
            setShowMap(false);
            setSelectedCity(e.target.value);
            formik.setFieldValue("latitude", 0);
            formik.setFieldValue("longitude", 0);
            formik.setFieldValue("city", citys[e.target.value - 1]?.name);
          }}
        >
          {citys.map((city, index) => {
            return (
              <option key={city.id} value={index + 1}>
                {city.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Jalan</FormLabel>
        <Input
          type={"text"}
          placeholder="Nama Jalan"
          bgColor="#F1FBF8"
          value={formik.values.street}
          onChange={(e) => {
            formik.setFieldValue("street", e.target.value);
            formik.setFieldValue("latitude", 0);
            formik.setFieldValue("longitude", 0);
          }}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Keterangan</FormLabel>
        <Textarea
          placeholder="No. rumah/gedung dan lain-lain."
          bgColor="#F1FBF8"
          value={formik.values.detail}
          onChange={(e) => {
            formik.setFieldValue("detail", e.target.value);
          }}
        />
      </FormControl>
      {showMap && !formik.values.longitude && !formik.values.latitude ? (
        <Alert status="error">
          <AlertIcon />
          Alamat tidak dapat ditemukan.
        </Alert>
      ) : null}
      <Button
        colorScheme="teal"
        variant="outline"
        w={"full"}
        leftIcon={<MdLocationOn />}
        isDisabled={selectedCity ? false : true}
        onClick={() => {
          setShowMap(!showMap);
        }}
      >
        Tambah Titik Lokasi
      </Button>
      {showMap && formik.values.longitude && formik.values.latitude ? (
        <MapContainer
          center={{
            lat: formik.values.latitude,
            lng: formik.values.longitude,
          }}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: 400, width: "100%", zIndex: 94 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={{
              lat: formik.values.latitude,
              lng: formik.values.longitude,
            }}
            ref={markerRef}
          >
            <Popup minWidth={90}>
              <span>Penunjuk dapat digeser.</span>
            </Popup>
          </Marker>
        </MapContainer>
      ) : null}
      <HStack alignItems={"center"} w={"full"}>
        <Switch
          id="isChecked"
          colorScheme="teal"
          onChange={() => {
            formik.setFieldValue("main", !formik.values.main);
          }}
          isChecked={formik.values.main}
        />
        <FormLabel htmlFor="isChecked">Ubah sebagai alamat utama</FormLabel>
      </HStack>
      <HStack w={"full"}>
        <Delete />
        <Button
          textColor={"white"}
          fontWeight={"medium"}
          bgColor={"#009262"}
          w={"full"}
          isDisabled={
            formik.values.latitude && formik.values.longitude && selectedCity
              ? false
              : true
          }
          _hover={{
            backgroundColor: "#00b377",
          }}
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          Simpan
        </Button>
      </HStack>
    </VStack>
  );
};

export default AddressUpdatePage;
