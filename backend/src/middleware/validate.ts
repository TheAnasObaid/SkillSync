import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validate =
  (schema: ZodObject<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      // Zod validation failed
      res.status(400).json(error);
    }
  };

export default validate;
