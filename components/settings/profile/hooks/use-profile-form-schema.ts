import { useTranslation } from "react-i18next";
import { z } from "zod";

export const useProfileFormSchema = () => {
  const { t } = useTranslation();
  return z.object({
    fullName: z
      .string()
      .min(1, t("formErrors.emptyText"))
      .max(30, t("formErrors.maxLength", { count: 30 })),
    phoneNumber: z
      .string()
      /*
        вот эта штука нужна? пользователь может сам вбить с тире номер?
        я бы в базе хранил без тире, чисто маской для визуала разделял бы тире
        сейчас бага, если нажать обновить данные пользака, ругается на эту проверку regex
      */
      .regex(/^[78]-(\d{3})-(\d{3})-(\d{2})-(\d{2})$/, t("formErrors.invalidPhoneNumber")),
    email: z
      .string()
      .email(t("formErrors.invalidEmail"))
      .max(30, t("formErrors.maxLength", { count: 30 })),
  });
};
