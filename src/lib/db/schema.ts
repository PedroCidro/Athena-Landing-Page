import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  decimal,
  pgEnum,
  primaryKey,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "member"]);
export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "in_progress",
  "completed",
  "on_hold",
  "cancelled",
]);
export const projectMemberRoleEnum = pgEnum("project_member_role", [
  "manager",
  "member",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "in_review",
  "done",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const clientStatusEnum = pgEnum("client_status", [
  "lead",
  "prospect",
  "active",
  "inactive",
]);
export const dealStatusEnum = pgEnum("deal_status", [
  "negotiating",
  "proposed",
  "won",
  "lost",
]);
export const interactionTypeEnum = pgEnum("interaction_type", [
  "whatsapp",
  "email",
  "call",
  "meeting",
  "note",
]);
export const calendarEventTypeEnum = pgEnum("calendar_event_type", [
  "meeting",
  "deadline",
  "reminder",
]);
export const attendeeStatusEnum = pgEnum("attendee_status", [
  "pending",
  "accepted",
  "declined",
]);

// ─── Users ───────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers),
  createdProjects: many(projects, { relationName: "createdBy" }),
  assignedTasks: many(tasks, { relationName: "assignedTo" }),
  createdTasks: many(tasks, { relationName: "taskCreatedBy" }),
  taskComments: many(taskComments),
  ownedClients: many(clients),
  createdDeals: many(deals),
  interactions: many(clientInteractions),
  createdEvents: many(calendarEvents),
  eventAttendees: many(eventAttendees),
  plannerNotes: many(plannerNotes, { relationName: "plannerNotes" }),
}));

// ─── Projects ────────────────────────────────────────
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: projectStatusEnum("status").notNull().default("planning"),
  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
    relationName: "createdBy",
  }),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  members: many(projectMembers),
  tasks: many(tasks),
  calendarEvents: many(calendarEvents),
}));

// ─── Project Members ─────────────────────────────────
export const projectMembers = pgTable(
  "project_members",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: projectMemberRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.userId] })]
);

export const projectMembersRelations = relations(
  projectMembers,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectMembers.projectId],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [projectMembers.userId],
      references: [users.id],
    }),
  })
);

// ─── Tasks ───────────────────────────────────────────
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  assignedTo: uuid("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  dueDate: timestamp("due_date", { withTimezone: true }),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "assignedTo",
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: "taskCreatedBy",
  }),
  comments: many(taskComments),
}));

// ─── Task Comments ───────────────────────────────────
export const taskComments = pgTable("task_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskComments.userId],
    references: [users.id],
  }),
}));

// ─── Clients ─────────────────────────────────────────
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  status: clientStatusEnum("status").notNull().default("lead"),
  source: varchar("source", { length: 255 }),
  notes: text("notes"),
  ownerId: uuid("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const clientsRelations = relations(clients, ({ one, many }) => ({
  owner: one(users, {
    fields: [clients.ownerId],
    references: [users.id],
  }),
  projects: many(projects),
  deals: many(deals),
  interactions: many(clientInteractions),
}));

// ─── Deals ───────────────────────────────────────────
export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }),
  status: dealStatusEnum("status").notNull().default("negotiating"),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const dealsRelations = relations(deals, ({ one }) => ({
  client: one(clients, {
    fields: [deals.clientId],
    references: [clients.id],
  }),
  creator: one(users, {
    fields: [deals.createdBy],
    references: [users.id],
  }),
}));

// ─── Client Interactions ─────────────────────────────
export const clientInteractions = pgTable("client_interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: interactionTypeEnum("type").notNull(),
  summary: text("summary").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const clientInteractionsRelations = relations(
  clientInteractions,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientInteractions.clientId],
      references: [clients.id],
    }),
    user: one(users, {
      fields: [clientInteractions.userId],
      references: [users.id],
    }),
  })
);

// ─── Calendar Events ─────────────────────────────────
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  allDay: boolean("all_day").notNull().default(false),
  type: calendarEventTypeEnum("type").notNull().default("meeting"),
  color: varchar("color", { length: 20 }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const calendarEventsRelations = relations(
  calendarEvents,
  ({ one, many }) => ({
    project: one(projects, {
      fields: [calendarEvents.projectId],
      references: [projects.id],
    }),
    creator: one(users, {
      fields: [calendarEvents.createdBy],
      references: [users.id],
    }),
    attendees: many(eventAttendees),
  })
);

// ─── Event Attendees ─────────────────────────────────
export const eventAttendees = pgTable(
  "event_attendees",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => calendarEvents.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: attendeeStatusEnum("status").notNull().default("pending"),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.userId] })]
);

export const eventAttendeesRelations = relations(
  eventAttendees,
  ({ one }) => ({
    event: one(calendarEvents, {
      fields: [eventAttendees.eventId],
      references: [calendarEvents.id],
    }),
    user: one(users, {
      fields: [eventAttendees.userId],
      references: [users.id],
    }),
  })
);

// ─── Influencer Outreach ────────────────────────────
export const outreachStatusEnum = pgEnum("outreach_status", [
  "contacted",
  "responded",
  "negotiating",
  "converted",
  "rejected",
]);
export const socialPlatformEnum = pgEnum("social_platform", [
  "instagram",
  "tiktok",
  "youtube",
  "twitter",
  "other",
]);
export const teamMemberEnum = pgEnum("team_member", [
  "Pedro",
  "Luiz",
  "Kyles",
]);

export const influencerOutreach = pgTable("influencer_outreach", {
  id: uuid("id").defaultRandom().primaryKey(),
  influencerName: varchar("influencer_name", { length: 255 }).notNull(),
  platform: socialPlatformEnum("platform").notNull().default("instagram"),
  handle: varchar("handle", { length: 255 }),
  followersCount: integer("followers_count"),
  contactedBy: teamMemberEnum("contacted_by").notNull(),
  status: outreachStatusEnum("status").notNull().default("contacted"),
  notes: text("notes"),
  contactDate: timestamp("contact_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Planner Notes ──────────────────────────────────
export const noteTypeEnum = pgEnum("note_type", ["hour", "day", "week"]);

export const plannerNotes = pgTable(
  "planner_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    member: text("member").notNull(),
    noteType: noteTypeEnum("note_type").notNull(),
    content: text("content").notNull(),
    targetDate: date("target_date").notNull(),
    targetHour: integer("target_hour"),
    targetHourEnd: integer("target_hour_end"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.member, t.noteType, t.targetDate, t.targetHour)]
);

export const plannerNotesRelations = relations(plannerNotes, ({ one }) => ({
  creator: one(users, {
    fields: [plannerNotes.createdBy],
    references: [users.id],
    relationName: "plannerNotes",
  }),
}));
