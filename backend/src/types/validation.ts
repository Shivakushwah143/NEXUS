import {z }from "zod"

export const  userSchema = z.object({
    username: z.string().min(5), 
    password: z.string().min(5)
}) 

export const productSchema = z.object({
    title : z.string().min(5).max(20,"title must be at list 10 characters"),
    description: z.string().min(20, "description must be atlist 15 latters"),
    price:z.number( ),
    colour:z.string(),
    image: z.string(),
    size: z.array(
  z.enum(["XS", "S", "M", "L", "XL"]).refine(
    (val) => ["XS", "S", "M", "L", "XL"].includes(val),
    { message: "Invalid size value" }
  )
).min(1),
})