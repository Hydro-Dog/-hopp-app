import { useTranslation } from "react-i18next";
import { z } from "zod";

export const useRegistrationFormSchema = () => {
  const { t } = useTranslation();
  return z.object({
    fullName: z
      .string()
      .min(1, t("formErrors.emptyText"))
      .max(30, t("formErrors.maxLength", { count: 30 })),
    phoneNumber: z.string().regex(/^[78]-(\d{3})-(\d{3})-(\d{2})-(\d{2})$/, t("formErrors.invalidPhoneNumber")),
    email: z
      .string()
      .email(t("formErrors.invalidEmail"))
      .max(30, t("formErrors.maxLength", { count: 30 })),
    password: z
      .string()
      .min(8, t("formErrors.minLength", { count: 8 }))
      .max(30, t("formErrors.maxLength", { count: 30 })),
    isPersonalDataProcessingAccepted: z.boolean().refine((val) => val === true, {
      message: t("formErrors.mustAccept"),
    }),
    isOfferAgreementAccepted: z.boolean().refine((val) => val === true, {
      message: t("formErrors.mustAccept"),
    }),
  });
};
