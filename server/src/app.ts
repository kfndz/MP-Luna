import express from "express";
import cors from "cors";
import { ProductService } from "./services/ProductService.js";
import { authRoutes } from "./routes/authRoutes.js";
import { requireAdminAuth } from "./middlewares/requireAdminAuth.js";
import { uploadVideoRoute, getUploadsRoot } from "./routes/uploadVideoRoute.js";

export function createApp() {
  const app = express();

  app.use(cors());

  app.use(
    express.json({
      limit: "15mb",
    }),
  );

  app.use(
    express.urlencoded({
      extended: true,
      limit: "15mb",
    }),
  );

  app.use("/api/auth", authRoutes);

  app.use("/uploads", express.static(getUploadsRoot()));

  app.use("/api/uploads-video", uploadVideoRoute);

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await ProductService.getAll();

      res.json(products);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Não foi possível carregar os produtos.",
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await ProductService.getById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Produto não encontrado.",
        });
      }

      res.json(product);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Não foi possível carregar o produto.",
      });
    }
  });

  app.post("/api/products", requireAdminAuth, async (req, res) => {
    try {
      const product = await ProductService.create(req.body);

      res.status(201).json(product);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível cadastrar o produto.",
      });
    }
  });

  app.put("/api/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const product = await ProductService.update(req.params.id, req.body);

      if (!product) {
        return res.status(404).json({
          message: "Produto não encontrado.",
        });
      }

      res.json(product);
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o produto.",
      });
    }
  });

  app.delete("/api/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const product = await ProductService.delete(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Produto não encontrado.",
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível excluir o produto.",
      });
    }
  });

  return app;
}