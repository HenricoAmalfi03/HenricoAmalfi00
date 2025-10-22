import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPublicationSchema, updatePublicationSchema } from "@shared/schema";
import { requireAuth } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Publications endpoints
  app.get("/api/publications", async (req, res) => {
    try {
      const publications = await storage.getAllPublications();
      res.json(publications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/publications/:id", async (req, res) => {
    try {
      const publication = await storage.getPublication(req.params.id);
      if (!publication) {
        return res.status(404).json({ error: "Publication not found" });
      }
      res.json(publication);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/publications", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPublicationSchema.parse(req.body);
      const supabaseClient = (req as any).supabaseClient;
      const publication = await storage.createPublicationWithClient(supabaseClient, validatedData);
      res.status(201).json(publication);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/publications/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = updatePublicationSchema.parse(req.body);
      const supabaseClient = (req as any).supabaseClient;
      const publication = await storage.updatePublicationWithClient(supabaseClient, req.params.id, validatedData);
      res.json(publication);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/publications/:id", requireAuth, async (req, res) => {
    try {
      const supabaseClient = (req as any).supabaseClient;
      await storage.deletePublicationWithClient(supabaseClient, req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Settings endpoints
  app.get("/api/settings/whatsapp", async (req, res) => {
    try {
      const setting = await storage.getSetting("whatsapp_number");
      res.json(setting?.value || "5511999999999");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/settings/site", async (req, res) => {
    try {
      const titleSetting = await storage.getSetting("site_title");
      const heroSetting = await storage.getSetting("hero_image");
      
      res.json({
        title: titleSetting?.value || "Meu Portfólio",
        heroImage: heroSetting?.value || "",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/settings/all", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      
      const settingsMap: any = {};
      settings.forEach(setting => {
        if (setting.key === "site_title") settingsMap.siteTitle = setting.value;
        if (setting.key === "hero_image") settingsMap.heroImage = setting.value;
        if (setting.key === "whatsapp_number") settingsMap.whatsappNumber = setting.value;
      });

      res.json(settingsMap);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings", requireAuth, async (req, res) => {
    try {
      const { siteTitle, heroImage, whatsappNumber } = req.body;
      const supabaseClient = (req as any).supabaseClient;

      if (siteTitle !== undefined) {
        await storage.setSettingWithClient(supabaseClient, { key: "site_title", value: siteTitle });
      }
      if (heroImage !== undefined) {
        await storage.setSettingWithClient(supabaseClient, { key: "hero_image", value: heroImage });
      }
      if (whatsappNumber !== undefined) {
        await storage.setSettingWithClient(supabaseClient, { key: "whatsapp_number", value: whatsappNumber });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
