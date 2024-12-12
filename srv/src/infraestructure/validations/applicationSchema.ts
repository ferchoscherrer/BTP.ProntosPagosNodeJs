import { z } from "zod"

// TODO

const ApplicationSchema = z.object({
    society: z
    .string({
        required_error: "Parameter 'society' is required.",
        invalid_type_error: "'Society' parameter must be a string."
    })
    .max(10,{ 
        message: "'society' must be 10 or fewer characters long."
    }),

    document: z
    .string({
        required_error: "Parameter 'document' is required.",
        invalid_type_error: "'document' parameter must be a string."
    })
    .max(10,{ 
        message: "'document' must be 10 or fewer characters long."
    }),

    ceco: z
    .string({
        required_error: "Parameter 'ceco' is required.",
        invalid_type_error: "'ceco' parameter must be a string."
    })
    .max(20,{ 
        message: "'ceco' must be 20 or fewer characters long."
    }),

    supplier: z
    .string({
        required_error: "Parameter 'supplier' is required.",
        invalid_type_error: "'supplier' parameter must be a string."
    })
    .max(20,{ 
        message: "'supplier' must be 20 or fewer characters long."
    }),

    money: z.string({
        required_error: "Parameter 'money' is required.",
        invalid_type_error: "'money' parameter must be a string."
    }),

    paymentDate: z.coerce.date({
        required_error: "Parameter 'paymentDate' is required.",
        invalid_type_error: "'paymentDate' parameter must be a date."
    }),
    
    reason: z
    .string({
        required_error: "Parameter 'reason' is required.",
        invalid_type_error: "'reason' parameter must be a string."
    })
    .max(255,{ 
        message: "'reason' must be 255 or fewer characters long."
    }),
})

export async function validateApplicationToCreate(appInstance: any) {
    await ApplicationSchema.parseAsync(appInstance)
}