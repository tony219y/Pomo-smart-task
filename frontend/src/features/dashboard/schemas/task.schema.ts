import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Name must be at least 3 characters"),
  Description: z.string(),
  DueDate: z.coerce
    .date()
    .min(
      new Date().setHours(0, 0, 0, 0),
      "Due date must be today or in the future",
    ),
  Estimated_time: z.coerce
    .number()
    .min(1, "Estimated time must more than 1 minute"),
});

export type TaskInput = z.infer<typeof taskSchema>;
