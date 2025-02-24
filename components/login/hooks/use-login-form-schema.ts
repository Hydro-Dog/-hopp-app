import { useTranslation } from "react-i18next";
import { z } from "zod";
import { LoginType, ZodShape } from "../types";

export const useLoginFormSchema = (loginType: LoginType) => {
  const { t } = useTranslation();

  const zodShape: ZodShape = {
    password: z
      .string()
      .min(1, t("formErrors.requiredField"))
      .min(8, t("formErrors.minLength", { count: 8 }))
      .max(30, t("formErrors.maxLength", { count: 30 })),
  };

  if (loginType === LoginType.EMAIL) {
    zodShape.email = z
      .string()
      .min(1, t("formErrors.requiredField"))
      .email(t("formErrors.invalidEmail"))
      .max(30, t("formErrors.maxLength", { count: 30 }));
  } else {
    zodShape.phoneNumber = z
      .string()
      .min(1, t("formErrors.requiredField"))
      .regex(/^[78]-(\d{3})-(\d{3})-(\d{2})-(\d{2})$/, t("formErrors.invalidPhoneNumber"));
  }

  return z.object(zodShape);
};
