import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PageProtected({
  children,
  needLogin = false,
  guestOnly = false,
  adminOnly = false,
  exceptUser = false,
}) {
  let navigate = useNavigate();
  let location = useLocation();

  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    localStorage.setItem("lastPath", location.pathname);
    if (needLogin && !userSelector?.id) {
      if (location.pathname.includes("admin")) {
        return navigate("/login", {
          replace: true,
        });
      } else {
        return navigate("/", {
          replace: true,
        });
      }
    }
    if (guestOnly && userSelector?.id) {
      return navigate("/", { replace: true });
    }
    if (adminOnly && userSelector?.role !== "ADMIN") {
      return navigate("/no-authority", { replace: true });
    }
    if (exceptUser && userSelector?.role === "USER") {
      return navigate("/no-authority", { replace: true });
    }
  }, []);
  return children;
}

export default PageProtected;
