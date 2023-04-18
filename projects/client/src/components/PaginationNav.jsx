import { Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationNav = ({ searchParamsState, pages }) => {
  const [searchParams, setSearchParams] = searchParamsState;

  const setPage = (page) =>
    setSearchParams((val) => {
      val.set(
        "page",
        typeof page === "boolean" ? +val.get("page") + (page ? 1 : -1) : page
      );
      return val;
    });

  return (
    <Flex justifyContent="space-between" overflowX="auto">
      <IconButton
        icon={<FaChevronLeft />}
        aria-label="barisan sebelumnya"
        variant="ghost"
        size="sm"
        isDisabled={!+searchParams.get("page")}
        onClick={() => setPage(false)}
      />
      <ButtonGroup>
        {pages?.map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            isActive={+searchParams.get("page") === value}
            _active={{ bgColor: "#009262", color: "#FCFCFC" }}
            onClick={() => setPage(value)}
          >
            {value + 1}
          </Button>
        ))}
      </ButtonGroup>
      <IconButton
        icon={<FaChevronRight />}
        aria-label="barisan selanjutnya"
        variant="ghost"
        size="sm"
        isDisabled={
          pages ? pages.length <= +searchParams.get("page") + 1 : true
        }
        onClick={() => setPage(true)}
      />
    </Flex>
  );
};

export default PaginationNav;
