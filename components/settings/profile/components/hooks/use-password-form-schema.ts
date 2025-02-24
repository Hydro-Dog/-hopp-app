import { useTranslation } from "react-i18next";
import { z } from "zod";

export const usePasswordFormSchema = () => {
  const { t } = useTranslation();
  return z.object({
    password: z
      .string()
      .min(8, t("formErrors.minLength", { count: 8 }))
      .max(30, t("formErrors.maxLength", { count: 30 })),
  });
};
