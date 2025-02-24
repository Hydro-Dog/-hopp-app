import { ZodString } from "zod";

export enum LoginType {
  EMAIL = "email",
  PHONE_NUMBER = "phone_number",
}

export type ZodShape = { [key: string]: ZodString };
