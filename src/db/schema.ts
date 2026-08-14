import {
  boolean,
  date,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  degree: varchar("degree", { length: 80 }).notNull(),
  description: text("description").notNull(),
  duration: varchar("duration", { length: 40 }).notNull(),
  icon: varchar("icon", { length: 40 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const campusEvents = pgTable("campus_events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  eventDate: date("event_date").notNull(),
  startTime: varchar("start_time", { length: 40 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const admissionInquiries = pgTable("admission_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  program: varchar("program", { length: 160 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Program = typeof programs.$inferSelect;
export type CampusEvent = typeof campusEvents.$inferSelect;
export type NewAdmissionInquiry = typeof admissionInquiries.$inferInsert;
