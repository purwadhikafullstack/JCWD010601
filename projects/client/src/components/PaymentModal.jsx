import {
  Button,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";

const PaymentModal = ({ isOpen, onClose, orderId, navigate }) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/orders/detail/${orderId}`,
        new FormData(e.target),
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Pembayaran anda sedang diverifikasi");
      alert("Pembayaran anda sudah diterima!");
      onClose();
      navigate(0);
    } catch (err) {
      console.error(err?.response.data ?? err);
    }
  };

  const onCloseComplete = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      onCloseComplete={onCloseComplete}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="x-large">
          Unggah Bukti Pembayaran
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Text fontWeight="semibold" fontSize="xl" mb={4}>
            Pastikan bukti pembayaran menampilkan berikut:
          </Text>
          <SimpleGrid columns={2} rowGap={10} columnGap={4}>
            {[
              {
                main: "Tanggal/Waktu Transfer",
                sub: "tgl, 04/06/22 / Jam 07:24:06",
              },
              {
                main: "Detail Penerima",
                sub: "Transfer ke Rekening NIAGAJAYA",
              },
              {
                main: "Status Berhasil",
                sub: "Transfer BERHASIL, Transaksi Sukses",
              },
              {
                main: "Jumlah Transfer",
                sub: "Rp276.124",
              },
            ].map(({ main, sub }, idx) => (
              <Text key={idx} fontWeight="semibold" fontSize="xl">
                {main}
                <br />
                <Text as="span" color="#7C7C7C" fontSize="medium">
                  contoh: {sub}
                </Text>
              </Text>
            ))}
          </SimpleGrid>
          <VStack
            as="form"
            id="payment-form"
            bgColor="#EAEAEA"
            borderRadius="10px"
            py={20}
            justifyContent="center"
            mt={12}
            spacing={4}
            onSubmit={handleSubmit}
          >
            {preview && (
              <Image src={preview} alt="bukti pembayaran" boxSize={44} />
            )}
            <Text color="#7C7C7C" fontWeight="medium" textAlign="center">
              JPEG/PNG di bawah 1MB
            </Text>
            <Button
              bgColor="#009262"
              color="#FFFFFF"
              w={60}
              onClick={() => {
                inputRef.current.value = "";
                inputRef.current.click();
              }}
            >
              Pilih Gambar
            </Button>
            <Button
              type="submit"
              bgColor="#FCFCFC"
              border="solid 1px #009262"
              color="#212121"
              w={60}
            >
              Unggah Bukti Pembayaran
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <FormControl h={0} w={0} isRequired>
            <Input
              ref={inputRef}
              type="file"
              name="receipt"
              accept="image/png, image/jpeg"
              h={0}
              w={0}
              opacity={0}
              form="payment-form"
              onChange={handleChange}
            />
          </FormControl>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
