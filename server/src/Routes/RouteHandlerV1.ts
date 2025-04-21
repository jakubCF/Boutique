import express from "express";
import BinsRouter from "./v1/bins.router";
import ItemsRouter from "./v1/items.router";

const RouteHandler = express.Router();

/* 
    Basic Validation Mock:
        - Check Request Body and Validate
        - Send to Controller
        - Return Response in a JSON object 
            - Message, Response Code || Data
*/
// Middleware to add a 2-second delay
RouteHandler.use((req, res, next) => {
    setTimeout(() => {
      next();
    }, 1000); // 1-second delay
  });
RouteHandler.use("/bins", BinsRouter);
RouteHandler.use("/items", ItemsRouter);

export default RouteHandler;
