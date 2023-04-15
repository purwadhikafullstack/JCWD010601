import { Box, Button, Flex } from "@chakra-ui/react";
import axios from "axios";
import {
  Form,
  Link as RouterLink,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import FormGrid from "../../../components/FormGrid";

/** @type {import("react-router-dom").ActionFunction} */
export const CreateProductCategoryAction = async ({ request }) => {
  try {
    await axios.post(
      `http://localhost:8000/api/v1/product-categories`,
      Object.fromEntries(await request.formData()),
      { withCredentials: true }
    );
    return redirect("..");
  } catch (err) {
    return err.response.data;
  }
};

const CreateProductCategoryPage = () => {
  const actionData = useActionData();
  const navigation = useNavigation();

  return (
    <AdminProductsLayout heading="Tambah Kategori Produk Baru">
      <Box as={Form} method="post">
        <Box
          bgColor="#FCFCFC"
          boxShadow="0 0 4px 1px rgba(00, 00, 00, 0.1)"
          borderRadius="4px"
          px={5}
          py={8}
        >
          <FormGrid actionData={actionData} />
        </Box>
        <Flex justifyContent="flex-end" my={10}>
          <Button
            as={RouterLink}
            to=".."
            mr={5}
            variant="outline"
            color="#009262"
            borderColor="#009262"
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={navigation.state === "submitting"}
            bgColor="#009262"
            color="white"
          >
            Tambah Baru
          </Button>
        </Flex>
      </Box>
    </AdminProductsLayout>
  );
};

export default CreateProductCategoryPage;
