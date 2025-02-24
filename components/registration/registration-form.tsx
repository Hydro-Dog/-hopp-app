import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useBoolean } from "usehooks-ts";
import { z } from "zod";
import { useRegistrationFormSchema } from "./hooks";
import ChoppCheckbox from "@/shared/components/chopp-checkbox";
import { ChoppDialog } from "@/shared/components/chopp-dialog";
import { ChoppFormField } from "@/shared/components/chopp-form-field";
import { useChoppSnackbar, SNACKBAR_VARIANTS } from "@/shared/components/chopp-snackbar-stack";
import { ChoppThemedText } from "@/shared/components/chopp-themed-text";
import { useChoppTheme } from "@/shared/context/chopp-theme-context";
import { FETCH_STATUS } from "@/shared/types/fetch-status";
import { ErrorResponse } from "@/shared/types/response-error";
import { formatPhoneNumber } from "@/shared/utils/format-phone-number";
import { createUser } from "@/store/slices/user-slice/index";
import { AppDispatch, RootState } from "@/store/store";

export const RegistrationForm = () => {
  const { theme } = useChoppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { value: passwordVisible, toggle: togglePasswordVisibility } = useBoolean();
  const { createUserStatus } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const registrationFormSchema = useRegistrationFormSchema();
  type RegistrationFormSchemaType = z.infer<typeof registrationFormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormSchemaType>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      isPersonalDataProcessingAccepted: false,
      isOfferAgreementAccepted: false,
    },
  });

  const { pushNewNotification } = useChoppSnackbar();

  const onSubmit: SubmitHandler<RegistrationFormSchemaType> = async (data) => {
    //TODO: вынести конструкцию по обработке ошибок запроса отдельно Часто переиспользуется
    try {
      const res = await dispatch(createUser(data)).unwrap();
      console.log("Redirect ", res);
      router.push("/login");
    } catch (error: unknown) {
      pushNewNotification({
        id: String(Math.random()),
        variant: SNACKBAR_VARIANTS.ERROR,
        text: (error as ErrorResponse).message,
      });
    }
  };

  const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useBoolean();

  const [modalData, setModalData] = useState<{ title: string; text: string }>();

  return (
    <View>
      <ChoppFormField errorMessage={errors.fullName?.message}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label={t("fullName")}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.fullName}
            />
          )}
        />
      </ChoppFormField>

      <ChoppFormField errorMessage={errors.phoneNumber?.message}>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType="number-pad"
              mode="outlined"
              label={t("phoneNumber")}
              value={value}
              onBlur={onBlur}
              onChangeText={(text) => onChange(formatPhoneNumber(text))}
              error={!!errors.phoneNumber}
            />
          )}
        />
      </ChoppFormField>
      <ChoppFormField errorMessage={errors.email?.message}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.email}
            />
          )}
        />
      </ChoppFormField>
      <ChoppFormField errorMessage={errors.password?.message}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label={t("password")}
              secureTextEntry={!passwordVisible}
              value={value}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  color={theme.colors.secondary}
                  size={20}
                  forceTextInputFocus={false}
                  onPress={togglePasswordVisibility}
                />
              }
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.password}
            />
          )}
        />
      </ChoppFormField>
      <ChoppFormField styles={{ marginBottom: 16 }} errorMessage={errors.isPersonalDataProcessingAccepted?.message}>
        <Controller
          control={control}
          name="isPersonalDataProcessingAccepted"
          render={({ field: { onChange, value } }) => (
            <ChoppCheckbox
              value={value}
              onChange={onChange}
              label={
                <>
                  <ChoppThemedText>{t("registrationForm.acceptPersonalDataProcessingMessage_1")} </ChoppThemedText>
                  <ChoppThemedText
                    variant="primary"
                    onPress={() => {
                      showModal();
                      setModalData({
                        title: t("registrationForm.acceptPersonalDataProcessingTitle"),
                        text: t("registrationForm.acceptPersonalDataProcessingText"),
                      });
                    }}
                  >
                    {t("registrationForm.acceptPersonalDataProcessingMessage_2")}
                  </ChoppThemedText>
                </>
              }
            />
          )}
        />
      </ChoppFormField>
      <ChoppFormField errorMessage={errors.isOfferAgreementAccepted?.message}>
        <Controller
          control={control}
          name="isOfferAgreementAccepted"
          render={({ field: { onChange, onBlur, value } }) => (
            <ChoppCheckbox
              value={value}
              onChange={onChange}
              label={
                <>
                  <ChoppThemedText>{t("registrationForm.acceptOfferDoc_1")} </ChoppThemedText>
                  <ChoppThemedText
                    variant="primary"
                    onPress={() => {
                      showModal();
                      setModalData({
                        title: t("acceptOfferDoc_1"),
                        text: t("acceptOfferDoc_2"),
                      });
                    }}
                  >
                    {t("registrationForm.acceptOfferDoc_2")}
                  </ChoppThemedText>
                </>
              }
            />
          )}
        />
      </ChoppFormField>

      <Button
        mode="contained"
        style={styles.registerButton}
        loading={createUserStatus === FETCH_STATUS.LOADING}
        disabled={createUserStatus === FETCH_STATUS.LOADING}
        onPress={handleSubmit(onSubmit)}
      >
        {t("actions.createAccount")}
      </Button>
      <ChoppDialog visible={isModalVisible} onClose={hideModal} onOk={hideModal} {...modalData} />
    </View>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    marginTop: 24,
  },
});
