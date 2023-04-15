import { IconButton } from "@chakra-ui/react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

const SortButton = ({ sortState, setSearchParams, column }) => {
  const [sort, setSort] = sortState;

  const handleClick = () => {
    const col = sort[1] === "desc" ? "" : column;
    const method = sort[0] !== column ? "asc" : sort[1] === "asc" ? "desc" : "";

    setSort([col, method]);

    setSearchParams((val) => {
      val.set("column", col);
      val.set("method", method);
      return val;
    });
  };

  return (
    <IconButton
      icon={
        sort[0] === column ? (
          sort[1] === "asc" ? (
            <FaSortUp />
          ) : (
            <FaSortDown />
          )
        ) : (
          <FaSort />
        )
      }
      size="xs"
      variant="unstyled"
      onClick={handleClick}
    />
  );
};

export default SortButton;
