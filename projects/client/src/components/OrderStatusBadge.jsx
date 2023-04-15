import { Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const entries = {
  unsettled: { message: "Biaya", bgColor: "#FFF8EC", color: "#FFB240" },
  requested: { message: "Aju", bgColor: "#F1FBF8", color: "#009262" },
  preparing: { message: "Olah", bgColor: "#F1FBF8", color: "#009262" },
  sending: { message: "Kirim", bgColor: "#F1FBF8", color: "#009262" },
  delivered: { message: "Tuntas", bgColor: "#F1FBF8", color: "#009262" },
  cancelled: { message: "Batal", bgColor: "#F1FBF8", color: "#009262" },
};

const OrderStatusBadge = ({ status }) => {
  const [badgeProps, setBadgeProps] = useState(null);

  useEffect(() => {
    setBadgeProps(entries?.[status]);
  }, [status]);

  return (
    <Badge px={2.5} bgColor={badgeProps?.bgColor} color={badgeProps?.color}>
      {badgeProps?.message}
    </Badge>
  );
};

export default OrderStatusBadge;
