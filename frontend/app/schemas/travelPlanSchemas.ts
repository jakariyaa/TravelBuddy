import { z } from "zod";

export const createTravelPlanSchema = z.object({
    destination: z.string().min(1, "Destination is required"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
    budget: z.union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => val > 0, "Budget must be a positive number"),
    travelType: z.enum(["SOLO", "FRIENDS", "GROUP", "FAMILY", "COUPLE"], {
        error: () => ({ message: "Please select a valid travel type (Solo, Friends, Group, Family, or Couple)" }),
    }),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    interests: z.string().optional(), // We'll handle splitting to array, or validation of comma-sep string if needed
});

export type CreateTravelPlanInput = z.infer<typeof createTravelPlanSchema>;
