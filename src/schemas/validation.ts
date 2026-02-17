import { z } from 'zod';

export const personalInfoSchema = z.object({
    fullName: z.string().min(2, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string()
        .min(8, "Phone number must be at least 8 characters")
        .max(12, "Phone number must not exceed 12 characters")
        .regex(/^[+0-9]+$/, "Phone can only contain plus (+) and numbers"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
    gitUrl: z.string().url("Invalid URL").optional().or(z.literal(''))
});

export const workExperienceItemSchema = z.object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    startDate: z.string().min(1, "Start Date is required"),
    // endDate is optional if isCurrentRole is true
    endDate: z.string().optional(),
    description: z.string().min(10, "Description is required (min 10 chars)"),
    isCurrentRole: z.boolean(),
}).refine((data) => {
    if (!data.isCurrentRole && !data.endDate) {
        return false;
    }
    return true;
}, {
    message: "End Date is required unless it is current role",
    path: ["endDate"],
});

export const workExperienceSchema = z.object({
    experiences: z.array(workExperienceItemSchema).refine((items) => items.every(() => {
        // Double check individual items are valid - though array schema handles it mostly
        // This is more for the overall array validation if needed
        return true;
    }))
});

export const questionnaireSchema = z.object({
    legalAuthorization: z.enum(['yes', 'no'], { errorMap: () => ({ message: "Please select an answer" }) }),
    availableIn30Days: z.enum(['yes', 'no'], { errorMap: () => ({ message: "Please select an answer" }) }),
    relocationSupport: z.enum(['yes', 'no'], { errorMap: () => ({ message: "Please select an answer" }) }),
    cvFile: z.custom<File>((val) => val instanceof File, "CV File is required")
        .refine((file) => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file?.type), {
            message: "Only PDF or DOCX files are allowed"
        })
});
