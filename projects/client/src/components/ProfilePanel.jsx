import {
  Box,
  Heading,
  TabPanel,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormElem from "./FormElem";
import FormModal from "./FormModal";
import ImageInput from "./ImageInput";
import ProfileItem from "./ProfileItem";
import StyledInput from "./StyledInput";
import PasswordInput from "./PasswordInput";

const ProfilePanel = () => {
  const [modal, setModal] = useState(null);
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const actionData = useActionData();
  // const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.id);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/${userId}`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        // navigate("/login");
        navigate("/");
      }
    })();
  }, [userId, navigate, response]);

  useEffect(() => {
    if (!isOpen && preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [isOpen, preview]);

  const handleClick = (modalObj) => {
    setResponse(null);
    setModal(modalObj);
    onOpen();
  };

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    if (selected) {
      if (selected.size > 1000000) {
        // alert("Hanya boleh foto berbentuk PNG atau JPEG");
        alert("Ukuran foto melebihi batas 1MB");
      } else {
        setPreview(URL.createObjectURL(selected));
        handleClick({
          fields: ["avatar"],
          header: "Foto Profil",
          msg: "Foto profil berhasil diubah!",
        });
        return;
      }
    }
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData =
      modal?.fields[0] === "avatar"
        ? new FormData(e.target)
        : Object.fromEntries(
            modal?.fields?.map((field) => [field, e.target[field].value])
          );

    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/users/${userId}`,
        formData,
        { headers: { withCredentials: true } }
      );
      setResponse(res.data);
    } catch (err) {
      alert(JSON.stringify(err.response.data));
      setResponse(err.response.data);
    }
  };

  return (
    <TabPanel as={VStack} spacing={4}>
      <Box as="section" w="full">
        <Heading as="h3" fontSize="2xl" mb={2}>
          Foto Profil
        </Heading>
        <Box bgColor="gray.50" borderRadius="md" p={4}>
          <ImageInput
            name="avatar"
            src={`http://localhost:8000/avatars/${data?.user?.imageUrl}`}
            // error={response?.errors?.avatar}
            form="form-profile"
            handleChange={handleChange}
          />
        </Box>
      </Box>
      <Box as="section" w="full">
        <Heading as="h3" fontSize="2xl" mb={2}>
          Rincian Profil
        </Heading>
        <Box bgColor="gray.50" borderRadius="md" p={4}>
          <ProfileItem
            id="name"
            label="Nama Pengguna"
            defaultValue={data?.user.names[0].name}
            handleClick={() => {
              handleClick({
                fields: ["name"],
                header: "Nama Pengguna",
                body: (
                  <FormElem
                    helperText="Hanya huruf alfabet dan spasi"
                    error={response?.errors?.name}
                  >
                    <StyledInput
                      name="name"
                      // placeholder="Nama Pengguna"
                      placeholder={data?.user.names[0].name}
                    />
                  </FormElem>
                ),
                msg: "Nama berhasil diubah!",
              });
            }}
          />
          <ProfileItem
            id="email"
            label="Alamat Surel"
            defaultValue={data?.user.email}
            handleClick={() => {
              handleClick({
                fields: ["email"],
                header: "Alamat Surel",
                body: (
                  <FormElem
                    helperText="Baru di situs ini dan bisa menerima surel masuk"
                    error={response?.errors?.email}
                  >
                    <StyledInput
                      name="email"
                      type="email"
                      // placeholder="Alamat Surel"
                      placeholder={data?.user.email}
                    />
                  </FormElem>
                ),
                msg: "Surel verifikasi telah terkirim!",
              });
            }}
          />
          <ProfileItem
            id="password"
            label="Kata Sandi"
            defaultValue="****"
            handleClick={() => {
              handleClick({
                fields: ["passwordOld", "passwordNew", "passwordConfirm"],
                header: "Kata Sandi",
                body: (
                  <>
                    <FormElem
                      helperText="Bila lupa, dapat disetel ulang melalui surel"
                      error={response?.errors?.passwordOld}
                    >
                      <PasswordInput
                        name="passwordOld"
                        placeholder="Kata Sandi Lama"
                      />
                    </FormElem>
                    <FormElem
                      helperText="Kata sandi mesti memiliki panjang 8 karakter atau lebih"
                      error={response?.errors?.passwordNew}
                    >
                      <PasswordInput
                        name="passwordNew"
                        placeholder="Kata Sandi Baru"
                      />
                    </FormElem>
                    <FormElem
                      helperText="Konfirmasi kata sandi mesti sama dengan kata sandi"
                      error={response?.errors?.passwordConfirm}
                    >
                      <PasswordInput
                        name="passwordConfirm"
                        placeholder="Konfirmasi Kata Sandi"
                      />
                    </FormElem>
                  </>
                ),
                msg: "Kata Sandi berhasil diubah!",
              });
            }}
          />
        </Box>
      </Box>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        id="form-profile"
        handleSubmit={handleSubmit}
        modal={modal}
        response={response}
        preview={preview}
      />
    </TabPanel>
  );
};

export default ProfilePanel;
