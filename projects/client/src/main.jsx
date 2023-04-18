import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import RootLayout from "./components/RootLayout";
import AdminProductCategoriesPage, {
  ProductCategoriesAction,
  ProductCategoriesLoader,
} from "./routes/admin/productCategories";
import CreateProductCategoryPage, {
  CreateProductCategoryAction,
} from "./routes/admin/productCategories/add";
import AdminProductsPage, {
  ProductsAction,
  ProductsLoader,
} from "./routes/admin/products";
import CreateProductPage, {
  CreateProductLoader,
  CreateProductAction,
} from "./routes/admin/products/add";
import ChangeEmailPage, { changeEmailAction } from "./routes/changeEmail";
import IndexPage from "./routes/index";
import LoginPage from "./routes/LoginPage";
import RegisterPage, { registerAction } from "./routes/register";
import SetPasswordPage, { setPasswordAction } from "./routes/setPassword";
import ResetPasswordEmail from "./routes/setPasswordEmail";
import SettingsPage from "./routes/settings";
import CheckoutPage from "./routes/checkout";
import OrdersPage from "./routes/orders";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import AuthProvider from "./hoc/authProvider";
import rootReducer from "./redux/store";

import "leaflet/dist/leaflet.css";

import NoAuthorityPage from "./routes/noAuthority";
import ProductDetailPage from "./routes/productDetail";
import ProductsPage from "./routes/products";
import SettingAddressPage from "./routes/settingAddress";
import AddressCreatePage from "./routes/addressCreate";
import AddressUpdatePage from "./routes/addressUpdate";
import PageProtected from "./routes/protected";
import CartPage from "./routes/cart";
import AdminOrdersPage from "./routes/admin/orders";
import WarehousePage from "./routes/admin/warehouses";
import WarehouseCreatePage from "./routes/admin/warehouses/create";
import WarehouseUpdatePage from "./routes/admin/warehouses/update";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: () => (
          <PageProtected>
            <IndexPage />
          </PageProtected>
        ),
      },
      { path: "register", Component: RegisterPage, action: registerAction },
      {
        path: "set-password/:token",
        Component: SetPasswordPage,
        action: setPasswordAction,
      },
      {
        path: "settings",
        Component: () => (
          <PageProtected needLogin={true}>
            <SettingsPage />
          </PageProtected>
        ),
        // Component: SettingsPage,
        // loader: settingsLoader,
        // action: settingsAction,
      },
      {
        path: "change-email/:token",
        Component: ChangeEmailPage,
        action: changeEmailAction,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "reset-password/email",
        Component: ResetPasswordEmail,
      },
      {
        path: "products",
        Component: ProductsPage,
      },
      {
        path: "products/:id",
        Component: ProductDetailPage,
      },
      {
        path: "no-authority",
        Component: NoAuthorityPage,
      },
      {
        path: "settings/address",
        Component: () => (
          <PageProtected needLogin={true}>
            <SettingAddressPage />
          </PageProtected>
        ),
      },
      {
        path: "settings/address/create",
        Component: () => (
          <PageProtected needLogin={true}>
            <AddressCreatePage />
          </PageProtected>
        ),
      },
      {
        path: "settings/address/edit/:id",
        Component: () => (
          <PageProtected needLogin={true}>
            <AddressUpdatePage />
          </PageProtected>
        ),
      },
      {
        path: "cart",
        Component: () => (
          <PageProtected needLogin={true}>
            <CartPage />
          </PageProtected>
        ),
      },
      { path: "checkout", Component: CheckoutPage },
      { path: "orders", Component: OrdersPage },
    ],
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      {
        path: "product-categories",
        children: [
          {
            index: true,
            Component: AdminProductCategoriesPage,
            loader: ProductCategoriesLoader,
            action: ProductCategoriesAction,
          },
          {
            path: "add",
            Component: CreateProductCategoryPage,
            action: CreateProductCategoryAction,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            index: true,
            Component: AdminProductsPage,
            loader: ProductsLoader,
            action: ProductsAction,
          },
          {
            path: "add",
            Component: CreateProductPage,
            loader: CreateProductLoader,
            action: CreateProductAction,
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            index: true,
            Component: () => (
              <PageProtected needLogin={true} exceptUser={true}>
                <AdminOrdersPage />
              </PageProtected>
            ),
          },
        ],
      },
      {
        path: "warehouses",
        children: [
          {
            index: true,
            Component: () => (
              <PageProtected needLogin={true} adminOnly={true}>
                <WarehousePage />
              </PageProtected>
            ),
          },
          {
            path: "create",
            Component: () => (
              <PageProtected needLogin={true} adminOnly={true}>
                <WarehouseCreatePage />
              </PageProtected>
            ),
          },
          {
            path: "update/:id",
            Component: () => (
              <PageProtected needLogin={true} adminOnly={true}>
                <WarehouseUpdatePage />
              </PageProtected>
            ),
          },
        ],
      },
    ],
  },
]);

const store = configureStore({ reducer: rootReducer });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
