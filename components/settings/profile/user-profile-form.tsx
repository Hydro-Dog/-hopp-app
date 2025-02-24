import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdatePassword } from "./components";
import { useProfileFormSchema } from "./hooks";
import { ChoppFormField } from "@/shared/components/chopp-form-field";
import { useChoppSnackbar, SNACKBAR_VARIANTS } from "@/shared/components/chopp-snackbar-stack";
import { FETCH_STATUS } from "@/shared/types/fetch-status";
import { formatPhoneNumber } from "@/shared/utils/format-phone-number";
import { updateCurrentUser, User } from "@/store/slices/user-slice/index";
import { AppDispatch, RootState } from "@/store/store";

type Props = {
  setViewMode: () => void;
};

export const UserProfileForm = ({ setViewMode }: Props) => {
  const [passwordMode, setPasswordMode] = useState<"view" | "edit">("view");
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { currentUser, updateCurrentUserStatus } = useSelector((state: RootState) => state.user);

  const profileFormSchema = useProfileFormSchema();
  type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: currentUser?.fullName,
      phoneNumber: currentUser?.phoneNumber,
      email: currentUser?.email,
    },
  });

  const { pushNewNotification } = useChoppSnackbar();

  const onSubmit: SubmitHandler<ProfileFormSchemaType> = async (data) => {
    try {
      await dispatch(updateCurrentUser(data)).unwrap();
      setViewMode();

      //TODO: убрать any
    } catch (error: any) {
      pushNewNotification({
        id: String(Math.random()),
        variant: SNACKBAR_VARIANTS.ERROR,
        text: error.errorMessage,
      });
    }
  };

  const onClose = () => {
    reset();
    setViewMode();
  };

  return (
    <View style={styles.container}>
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
                disabled={passwordMode === "edit"}
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
            render={({ field: { onChange, onBlur, value } }) => {
              const inputValue = formatPhoneNumber(value);

              return (
                <TextInput
                  keyboardType="number-pad"
                  mode="outlined"
                  label={t("phoneNumber")}
                  disabled={passwordMode === "edit"}
                  value={inputValue}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.phoneNumber}
                />
              );
            }}
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
                disabled={passwordMode === "edit"}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.email}
              />
            )}
          />
        </ChoppFormField>

        <UpdatePassword mode={passwordMode} setMode={setPasswordMode} />
      </View>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          loading={updateCurrentUserStatus === FETCH_STATUS.LOADING}
          disabled={updateCurrentUserStatus === FETCH_STATUS.LOADING || passwordMode === "edit"}
          onPress={handleSubmit(onSubmit)}
        >
          {t("save")}
        </Button>
        <Button
          mode="outlined"
          loading={updateCurrentUserStatus === FETCH_STATUS.LOADING}
          disabled={updateCurrentUserStatus === FETCH_STATUS.LOADING}
          onPress={onClose}
        >
          {t("cancel")}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    // paddingVertical: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // paddingBottom: 64,
  },
  buttons: {
    gap: 16,
  },
});
