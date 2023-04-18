import { Button, Divider, Link, Text } from "@chakra-ui/react";
import axios from "axios";
import {
  Link as RouterLink,
  useActionData,
  useNavigation,
} from "react-router-dom";
import ecoBagImg from "../assets/Eco bag with food.png";
import AuthLayout from "../components/AuthLayout";
import FormElem from "../components/FormElem";
import StyledInput from "../components/StyledInput";

/** @type {import("react-router-dom").ActionFunction} */
export const registerAction = async ({ request }) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/auth/register",
      Object.fromEntries(await request.formData()),
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    const unknownErr = err.response.data.errors.unknown;
    if (unknownErr) {
      alert(JSON.stringify(unknownErr));
    }
    return err.response.data;
  }
};

const RegisterPage = () => {
  const actionData = useActionData();
  const navigation = useNavigation();

  return (
    <AuthLayout
      actionData={actionData}
      src={ecoBagImg}
      alt="tas ramah lingkungan"
      heading="Pendaftaran"
    >
      <FormElem
        error={actionData?.errors?.email}
        helperText="Baru di situs ini dan bisa menerima surel masuk"
      >
        <StyledInput type="email" name="email" placeholder="Alamat Surel" />
      </FormElem>
      <FormElem
        error={actionData?.errors?.name}
        helperText="Hanya huruf alfabet dan spasi"
      >
        <StyledInput
          name="name"
          placeholder="Nama Pengguna"
          maxLength={255}
          pattern="^[a-zA-Z\s]+$"
        />
      </FormElem>
      <Text fontSize="x-small" px={5} textAlign="center">
        Dengan mendaftar, Saya menyetujui&#32;
        <Link as={RouterLink} to="#" color="#009262">
          Syarat dan Ketentuan
        </Link>
        &#32;serta&#32;
        <Link as={RouterLink} to="#" color="#009262">
          Kebijakan Privasi
        </Link>
      </Text>
      <Button
        type="submit"
        isLoading={navigation.state === "submitting"}
        bgColor="#009262"
        color="#FCFCFC"
        w="full"
      >
        Buat Akun
      </Button>
      <Divider />
    </AuthLayout>
  );
};

export default RegisterPage;
