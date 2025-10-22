import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de publicações de projetos
export const publications = pgTable("publications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Configurações gerais do site
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

// Schemas de validação para publicações
export const insertPublicationSchema = createInsertSchema(publications).omit({
  id: true,
  createdAt: true,
});

export const updatePublicationSchema = createInsertSchema(publications).omit({
  createdAt: true,
}).partial();

// Schemas de validação para settings
export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

// Types
export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type UpdatePublication = z.infer<typeof updatePublicationSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

// Schema para item do carrinho (client-side only)
export const cartItemSchema = z.object({
  publicationId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  monthlyPrice: z.string(),
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Schema para checkout
export const checkoutSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  observation: z.string().optional(),
  paymentMethod: z.enum(["debit", "credit", "cash", "pix"], {
    required_error: "Selecione um método de pagamento",
  }),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;

// Schema para projetos personalizados
export const customProjectSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

export type CustomProjectData = z.infer<typeof customProjectSchema>;
