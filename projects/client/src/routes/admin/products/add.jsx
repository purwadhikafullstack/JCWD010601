import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import {
  Form,
  Link as RouterLink,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import AdminProductsLayout from "../../../components/AdminProductsLayout";
import FormGrid from "../../../components/FormGrid";

/** @type {import("react-router-dom").LoaderFunction} */
export const CreateProductLoader = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/product-categories`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

/** @type {import("react-router-dom").ActionFunction} */
export const CreateProductAction = async ({ request }) => {
  try {
    await axios.post(
      `http://localhost:8000/api/v1/products`,
      Object.fromEntries(await request.formData()),
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return redirect("..");
  } catch (err) {
    alert(JSON.stringify(err.response.data));
    return err.response.data;
  }
};

const CreateProductPage = () => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const data = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    if (selected) {
      if (selected.size > 1000000) {
        alert("Ukuran foto melebihi batas 1MB");
      } else {
        return setPreview(URL.createObjectURL(selected));
      }
    }
    setPreview(null);
  };

  return (
    <AdminProductsLayout heading="Tambah Produk Baru">
      <Box as={Form} method="post" encType="multipart/form-data">
        <Box
          bgColor="#FCFCFC"
          boxShadow="0 0 4px 1px rgba(00, 00, 00, 0.1)"
          borderRadius="4px"
          px={5}
          py={8}
        >
          <FormGrid actionData={actionData}>
            <FormControl isInvalid={actionData?.errors?.category} isRequired>
              <FormLabel htmlFor="category">Kategori</FormLabel>
            </FormControl>
            <FormControl isInvalid={actionData?.errors?.category} isRequired>
              <Select id="category" name="category" placeholder="--">
                {data?.productCategories?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isInvalid={actionData?.errors?.description} isRequired>
              <FormLabel htmlFor="description">Deskripsi</FormLabel>
            </FormControl>
            <FormControl isInvalid={actionData?.errors?.description} isRequired>
              <Textarea id="description" name="description" />
            </FormControl>
            <FormControl
              isInvalid={actionData?.errors?.priceRupiahPerUnit}
              isRequired
            >
              <FormLabel htmlFor="priceRupiahPerUnit">Harga Rupiah</FormLabel>
            </FormControl>
            <FormControl
              isInvalid={actionData?.errors?.priceRupiahPerUnit}
              isRequired
            >
              <NumberInput
                id="priceRupiahPerUnit"
                name="priceRupiahPerUnit"
                precision={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="image">Foto</FormLabel>
              <FormHelperText>JPEG/PNG di bawah 1MB</FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <Flex>
                <Center
                  w={24}
                  h={24}
                  border="dashed 1px rgba(113, 113, 113, 0.5)"
                  borderRadius="4px"
                  onClick={() => {
                    inputRef.current.value = null;
                    inputRef.current.click();
                  }}
                >
                  {preview ? (
                    <Image src={preview} alt="product image" />
                  ) : (
                    <Icon
                      as={FaImage}
                      boxSize={10}
                      color="rgba(113, 113, 113, 0.5)"
                    />
                  )}
                </Center>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/png, image/jpeg"
                  h="0"
                  w="0"
                  opacity="0"
                  ref={inputRef}
                  onChange={handleChange}
                />
              </Flex>
            </FormControl>
          </FormGrid>
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

export default CreateProductPage;
