import { Button, HStack } from "@chakra-ui/react";

const PaginationNumber = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(i);
      }
    }
  }

  return (
    <HStack mt={4} spacing={4}>
      {pageNumbers.map((number) => (
        <Button
          borderRadius={"md"}
          key={number}
          isActive={currentPage === number}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ))}
    </HStack>
  );
};

export default PaginationNumber;
