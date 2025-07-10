import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  res.send(req.body);
});

export default router;
