import express from "express";
import BinsRouter from "./bins.router";
import ItemsRouter from "./items.router";

const RouteHandler = express.Router();

/* 
    Basic Validation Mock:
        - Check Request Body and Validate
        - Send to Controller
        - Return Response in a JSON object 
            - Message, Response Code || Data
*/
RouteHandler.use((_, __, next) => {
    setTimeout(() => {
      next();
    }, 300); // 3-millisecond delay
  });
RouteHandler.use("/bins", BinsRouter);
RouteHandler.use("/items", ItemsRouter);

export default RouteHandler;