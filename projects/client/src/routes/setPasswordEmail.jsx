import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { axiosInstance } from "../config/config";
import PageProtected from "./protected";

const ResetPasswordEmail = () => {
  let navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email tidak boleh kosong")
        .email("Email tidak sesuai format"),
    }),
    onSubmit: () => {
      axiosInstance
        .post("/auth/v4", formik.values)
        .then((res) => {
          setStatus("success");
          setMsg(res.data.msg);
        })
        .catch((error) => {
          setStatus("error");
          if (typeof error.response.data?.errors?.email === "object") {
            setMsg(error.response.data.errors.email.msg);
          } else {
            setMsg(error.message);
          }
        });
    },
  });

  return (
    <PageProtected>
      <Flex
        h={"full"}
        p={"4"}
        mx="auto"
        maxW="md"
        boxShadow="0 8px 16px rgba(171, 190, 209, 0.4)"
        borderRadius="10px"
      >
        <VStack borderRadius="10px" p={5} w={"full"} alignItems={"center"}>
          <Heading fontSize="3xl" mb={5}>
            Buat Password Baru
          </Heading>
          <FormControl>
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
            <Input
              variant="filled"
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

          <HStack w={"full"}>
            <Button
              colorScheme={"teal"}
              variant="outline"
              px={"5"}
              onClick={() => {
                const lastPath = localStorage.getItem("lastPath");
                if (lastPath) {
                  navigate(lastPath, { replace: true });
                } else {
                  navigate("/", { replace: true });
                }
              }}
            >
              Kembali
            </Button>
            <Button
              bgColor="#009262"
              color="#FCFCFC"
              w="full"
              onClick={formik.handleSubmit}
              _hover={{
                backgroundColor: "#00b377",
              }}
            >
              Kirim Kode Verifikasi
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </PageProtected>
  );
};

export default ResetPasswordEmail;
