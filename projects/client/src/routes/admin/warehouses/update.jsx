import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { axiosInstance } from "../../../config/config";

const WarehouseUpdatePage = () => {
  const navigate = useNavigate();
  const routeParams = useParams();
  const markerRef = useRef(null);

  const [provinces, setProvinces] = useState([]);
  const [citys, setCitys] = useState([]);
  const [managers, setManagers] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(0);
  const [selectedCity, setSelectedCity] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: "",
      province: "",
      city: "",
      district: "",
      managerId: 0,
      detail: "",
      latitude: 0,
      longitude: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Nama tidak boleh kosong"),
      province: Yup.string().required("Provinsi tidak boleh kosong"),
      city: Yup.string().required("Kota/Kabupaten tidak boleh kosong"),
      detail: Yup.string().required("Keterangan tidak boleh kosong"),
      managerId: Yup.number().min(1, "Manager tidak boleh kosong"),
    }),
    onSubmit: async () => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${formik.values.latitude}&lon=${formik.values.longitude}&accept-language=id`
        );

        const localCity = formik.values.city.split(" ").join("").toLowerCase();
        if (res.data.address?.city) {
          const serverCity = res.data.address?.city
            .split(" ")
            .join("")
            .toLowerCase();
          if (
            !localCity.includes(serverCity) &&
            !serverCity.includes(localCity)
          ) {
            throw new Error("Titik Lokasi tidak sesuai dengan Kota/Kabupaten");
          }
        } else if (res.data.address?.county) {
          const serverCity = res.data.address?.county
            .split(" ")
            .join("")
            .toLowerCase();
          if (
            !localCity.includes(serverCity) &&
            !serverCity.includes(localCity)
          ) {
            throw new Error("Titik Lokasi tidak sesuai dengan Kota/Kabupaten");
          }
        } else {
          throw new Error("Titik Lokasi tidak sesuai dengan Kota/Kabupaten");
        }

        await axiosInstance.put(
          "/warehouses/v1/" + routeParams.id,
          { ...formik.values, district: res.data.address.village ?? "" },
          {
            withCredentials: true,
          }
        );
        setStatus("success");
        setMsg("Data warehouse berhasil diperberbarui");
      } catch (error) {
        setStatus("error");
        if (Array.isArray(error.response.data?.message)) {
          const errorMessages = error.response.data.message
            .map((msgObj) => `- ${msgObj.msg}`)
            .join("\n");
          setMsg(errorMessages);
        } else if (typeof error.response.data?.message === "object") {
          setMsg(JSON.stringify(error.response.data.message));
        } else {
          setMsg(error.message);
        }
      }
    },
  });

  async function fetchPosition(province_name, city_name) {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/?addressdetails=1&county=${city_name}&country=Indonesia&state=${province_name}&format=json&limit=1&accept-language=id`
      );
      if (res.data.length) {
        formik.setFieldValue("latitude", res.data[0]?.lat);
        formik.setFieldValue("longitude", res.data[0]?.lon);
      } else {
        throw new Error("Titik lokasi tidak dapat ditemukan");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMsg(error.message);
    }
  }

  async function fetchCitys(province_id) {
    try {
      const res = await axiosInstance.get(
        `/address/v1/city?province=${province_id}`
      );
      const listCity = await res.data.results.map((data) => {
        return { id: data.city_id, name: data.city_name };
      });
      setCitys(listCity);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMsg("Daftar Kota/Kabupaten gagal dimuat.");
    }
  }

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          formik.setFieldValue("latitude", marker.getLatLng().lat);
          formik.setFieldValue("longitude", marker.getLatLng().lng);
          setStatus("");
          setMsg("");
        }
      },
    }),
    []
  );

  useEffect(() => {
    async function fetchWarehouse(id) {
      try {
        const res = await axiosInstance.get(`/warehouses/v1/${id}`, {
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

        try {
          const responseManagers = await axiosInstance.get(
            "/warehouses/v2/" + res.data.managerId,
            {
              withCredentials: true,
            }
          );

          const listManager = await responseManagers.data.map((data) => {
            return { id: data.id, email: data.email };
          });
          setManagers(listManager);
        } catch (error) {
          throw new Error("Daftar Manager gagal dimuat.");
        }

        formik.setFieldValue("name", res.data.name);
        formik.setFieldValue("managerId", res.data.managerId);
        formik.setFieldValue("province", res.data.province);
        formik.setFieldValue("city", res.data.city);
        formik.setFieldValue("detail", res.data.detail);
        formik.setFieldValue("latitude", res.data.latitude);
        formik.setFieldValue("longitude", res.data.longitude);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setNotFound(true);
        console.error(error);
        setStatus("error");
        setMsg(error.message);
      }
    }
    fetchWarehouse(routeParams.id);
  }, []);

  useEffect(() => {
    setCitys([]);
    setSelectedCity(0);
    if (selectedProvince) {
      fetchCitys(provinces[selectedProvince - 1]?.id);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedProvince && selectedCity) {
      fetchPosition(
        provinces[selectedProvince - 1]?.name,
        citys[selectedCity - 1]?.name
      );
      setShowMap(true);
    }
  }, [showMap]);

  useEffect(() => {
    if (
      formik.values.name &&
      formik.values.managerId &&
      formik.values.province &&
      formik.values.city &&
      formik.values.detail &&
      formik.values.latitude &&
      formik.values.longitude
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formik.values]);

  return (
    <Box px={8} flex={1} overflowY="auto">
      <Heading py={7}>Edit Warehouse</Heading>
      {!loading ? (
        <VStack
          alignItems={"start"}
          gap={5}
          bg={"white"}
          p={5}
          borderWidth="1px"
          borderRadius="lg"
        >
          <FormControl>
            <Input
              type="text"
              name="name"
              bgColor="#F1FBF8"
              placeholder="Name"
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
            />
            <FormHelperText w={"full"} textAlign={"start"}>
              {formik.errors.name}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              name="manager"
              placeholder="Pilih Manager"
              bgColor="#F1FBF8"
              onChange={(e) => {
                formik.setFieldValue("managerId", e.target.value);
              }}
              value={formik.values.managerId ? formik.values.managerId : 0}
            >
              {managers.map((manager) => {
                return (
                  <option key={manager.id} value={manager.id}>
                    {manager.email}
                  </option>
                );
              })}
            </Select>
            <FormHelperText w={"full"} textAlign={"start"}>
              {formik.errors.managerId}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              name="province"
              placeholder="Pilih Provinsi"
              bgColor="#F1FBF8"
              value={selectedProvince ? selectedProvince : 0}
              onChange={(e) => {
                formik.setFieldValue("latitude", 0);
                formik.setFieldValue("longitude", 0);
                setShowMap(false);
                setSelectedProvince(e.target.value);
                formik.setFieldValue(
                  "province",
                  provinces[e.target.value - 1]?.name
                );
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
            <FormHelperText w={"full"} textAlign={"start"}>
              {formik.errors.province}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              name="city"
              placeholder="Pilih Kota/Kabupaten"
              bgColor="#F1FBF8"
              value={selectedCity ? selectedCity : 0}
              onChange={(e) => {
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
            <FormHelperText w={"full"} textAlign={"start"}>
              {formik.errors.city}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Textarea
              name="detail"
              bgColor="#F1FBF8"
              placeholder="Keterangan"
              value={formik.values.detail}
              onChange={(e) => {
                formik.setFieldValue("detail", e.target.value);
              }}
            />
            <FormHelperText w={"full"} textAlign={"start"}>
              {formik.errors.detail}
            </FormHelperText>
          </FormControl>
          {status === "error" ? (
            <Alert
              status="error"
              zIndex={2}
              variant="top-accent"
              fontSize={"md"}
              mb={"1"}
            >
              <AlertIcon />
              {msg}
            </Alert>
          ) : status === "success" ? (
            <Alert
              status="success"
              zIndex={2}
              variant="top-accent"
              fontSize={"md"}
              mb={"1"}
            >
              <AlertIcon />
              {msg}
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
          {showMap && formik.values.latitude && formik.values.longitude ? (
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
          <HStack w={"full"}>
            <Button
              onClick={() => {
                navigate("/admin/warehouses");
              }}
            >
              Kembali
            </Button>
            <Button
              textColor={"white"}
              fontWeight={"medium"}
              bgColor={"#009262"}
              w={"full"}
              isDisabled={isDisabled}
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
      ) : (
        <Center h={"80vh"} bg={"white"} fontWeight={"bold"}>
          {!notFound ? (
            <Text>Loading ...</Text>
          ) : (
            <VStack>
              <Text>Warehouse tidak ditemukan</Text>
              <Button
                onClick={() => {
                  navigate("/admin/warehouses");
                }}
              >
                Kembali
              </Button>
            </VStack>
          )}
        </Center>
      )}
    </Box>
  );
};

export default WarehouseUpdatePage;
