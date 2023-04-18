import { Heading, Text } from "@chakra-ui/react";

function NoAuthorityPage() {
  return (
    <div>
      <Heading as="h1" size="xl">
        Tidak Ada Otoritas
      </Heading>
      <Text mt={4} fontSize="lg">
        Maaf, Anda tidak memiliki otoritas untuk menggunakan/mengakses halaman
        tersebut.
      </Text>
      <Text mt={2} fontSize="md">
        Silakan hubungi administrator untuk mendapatkan akses.
      </Text>
    </div>
  );
}

export default NoAuthorityPage;
