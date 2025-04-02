import "dotenv/config";
import express from "express";
import RouteHandler from "./Routes/RouteHandlerV1";
import cors from "cors"

const main = async () => {
  const app = express();
  const port = 3000;

  app.use(express.json());
  app.use(cors({
    origin: "*",
  }));
  // Routes
  app.use("/v1", RouteHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

main();
