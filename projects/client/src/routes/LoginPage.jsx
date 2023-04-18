import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import paperBagImg from "../assets/paper-bag.png";
import { axiosInstance } from "../config/config";
import user_types from "../redux/auth/types";
import PageProtected from "./protected";

const LoginPage = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState(false);
  const [msg, setMsg] = useState("");
  const [hide, setHide] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email tidak boleh kosong")
        .email("Email tidak sesuai format"),
      password: Yup.string().required("Password tidak boleh kosong"),
    }),
    onSubmit: () => {
      axiosInstance
        .post("/auth/v2", formik.values, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            dispatch({
              type: user_types.USER_LOGIN,
              payload: res.data.result,
            });
            const lastPath = localStorage.getItem("lastPath");
            if (lastPath) {
              navigate(lastPath, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        })
        .catch((error) => {
          setStatus(true);
          setMsg(error.response.data.message);
        });
    },
  });

  return (
    <Flex
      mx="auto"
      maxW="5xl"
      boxShadow={{ lg: "0 8px 16px rgba(171, 190, 209, 0.4)" }}
      borderRadius="10px"
      justifyContent="space-evenly"
      flexDir={{ base: "column-reverse", lg: "row" }}
    >
      <Center>
        <Image src={paperBagImg} alt="eco bag with food" />
      </Center>
      <Center flexDir="column">
        <Heading fontSize="3xl" mb={5}>
          Masuk ke akun Anda
        </Heading>
        <Box border="solid #EBEBEB 1px" borderRadius="10px" p={5} w={96}>
          <VStack spacing={5}>
            <FormControl>
              {status ? (
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
              ) : null}
              <Input
                type="email"
                name="email"
                bgColor="#F1FBF8"
                placeholder="Email"
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
              />
              <FormHelperText w={"full"} textAlign={"start"}>
                {formik.errors.email}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <InputGroup>
                <Input
                  type={hide ? "password" : "text"}
                  name="password"
                  placeholder="Password"
                  bgColor="#F1FBF8"
                  onChange={(e) =>
                    formik.setFieldValue("password", e.target.value)
                  }
                />
                <InputRightElement w={10}>
                  <IconButton
                    aria-label="toggle password visibility"
                    icon={!hide ? <FaEye /> : <FaEyeSlash />}
                    variant="ghost"
                    size="sm"
                    tabIndex={-1}
                    onClick={() => {
                      setHide(!hide);
                    }}
                  />
                </InputRightElement>
              </InputGroup>

              <FormHelperText w={"full"} textAlign={"start"}>
                {formik.errors.password}
              </FormHelperText>
            </FormControl>
            <Link
              w={"full"}
              fontSize={"sm"}
              textAlign={"right"}
              textColor={"gray.500"}
              onClick={() => {
                navigate("/reset-password/email", { replace: true });
              }}
            >
              Lupa Password?
            </Link>
            <Button
              bgColor="#009262"
              color="#FCFCFC"
              w="full"
              onClick={formik.handleSubmit}
              _hover={{
                backgroundColor: "#00b377",
              }}
            >
              Masuk
            </Button>
          </VStack>
        </Box>
      </Center>
    </Flex>
  );
};

export default LoginPage;
