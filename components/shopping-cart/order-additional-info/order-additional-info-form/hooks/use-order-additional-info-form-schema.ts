import { useTranslation } from "react-i18next";
import { z } from "zod";

export const useOrderAdditionalInfoFormSchema = () => {
  const { t } = useTranslation();
  return z.object({
    address: z
      .string()
      .min(10, `${t("formErrors.minLength", { count: 10 })}`)
      .max(1024, `${t("formErrors.maxLength", { count: 1024 })}`),
    comment: z.string().max(2048, `${t("formErrors.maxLength", { count: 2048 })}`),
  });
};
