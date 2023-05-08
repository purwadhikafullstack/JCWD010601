"use strict";

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env");  
});
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const port = +(process.env.PORT || 8000);
const app = express();
// const redisStore = new RedisStore({
//   client: redis,
//   disableTouch: true,
// });

// app.set("trust proxy", 1)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    // store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY_SESSION,
    cookie: {
      maxAge: 31536000000, // 365 days
      httpOnly: true,
      sameSite: "lax",
      secure: "auto",
    },
  })
);
app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static("./public", { index: false }));

const routes = require("./routes/index.cjs");
app.use("/auth", routes.authRoute);
app.use("/address", routes.addressRoute);
app.use("/warehouses", routes.warehousesRoute);
app.use("/products", routes.productRoute);
app.use("/categories", routes.categoryRoute);
app.use("/orders", routes.orderRoute);

app
  .use("/api/v1/auth", require("./routes/auth.cjs"))
  .use("/api/v1/users", require("./routes/users.cjs"))
  .use("/api/v1/product-categories", require("./routes/productCategories.cjs"))
  .use("/api/v1/products", require("./routes/products.cjs"))
  .use("/api/v1/orders", require("./routes/orders.cjs"))
  .use("/api/v1/checkout", require("./routes/checkout.cjs"));

app.listen(port, () => {
  console.log(`APP RUNNING at ${port} ✅`);
});
