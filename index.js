// import express from "express";
import express from "express";
import {userRouter} from "./routes/userRoutes.js";
import {productRouter} from "./routes/productRoutes.js";
import { stockInRouter } from "./routes/stockInRoutes.js";
import { stockOutRouter } from "./routes/stockOutRoutes.js";
import cors from "cors";
import createProductTable from "./models/productTable.js";
import createStock_transactions from "./models/StockInTracnstions.js";
import createStock_transactions_out from "./models/stockOutModel.js";
import createUsersTable from "./models/userModel.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// // table creation
// await createUsersTable()
// await createProductTable()
// await createStock_transactions()
// await createStock_transactions_out()


// api route
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/stock-in", stockInRouter);
app.use("/api/stock-out", stockOutRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});