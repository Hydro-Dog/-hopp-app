import { Dispatch, SetStateAction } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoolean } from "usehooks-ts";
import { z } from "zod";
import { usePasswordFormSchema } from "./hooks";
import { ChoppFormField } from "@/shared/components/chopp-form-field";
import { useChoppSnackbar, SNACKBAR_VARIANTS } from "@/shared/components/chopp-snackbar-stack";
import { useChoppTheme } from "@/shared/context/chopp-theme-context";
import { FETCH_STATUS } from "@/shared/types/fetch-status";
import { updateCurrentUser } from "@/store/slices/user-slice/index";
import { AppDispatch, RootState } from "@/store/store";

type Props = {
  mode: "view" | "edit";
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
};

export const UpdatePassword = ({ mode, setMode }: Props) => {
  const { theme } = useChoppTheme();
  const { t } = useTranslation();
  const { value: passwordVisible, toggle: togglePasswordVisibility } = useBoolean();
  const { updateCurrentUserStatus } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const passwordFormSchema = usePasswordFormSchema();
  type PasswordFormSchemaType = z.infer<typeof passwordFormSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormSchemaType>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const { pushNewNotification } = useChoppSnackbar();

  const onClose = () => {
    reset();
    setMode("view");
  };

  const onSubmit: SubmitHandler<PasswordFormSchemaType> = async (data) => {
    try {
      await dispatch(updateCurrentUser(data)).unwrap();
      setMode("view");

      //TODO: убрать any
    } catch (error: any) {
      pushNewNotification({
        id: String(Math.random()),
        variant: SNACKBAR_VARIANTS.ERROR,
        text: error.errorMessage,
      });
    }
  };

  return mode === "view" ? (
    <Button mode="contained" onPress={() => setMode("edit")}>
      {t("changePassword")}
    </Button>
  ) : (
    <View>
      <ChoppFormField message={t("enterNewPassword")} errorMessage={errors.password?.message}>
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
                  loading={updateCurrentUserStatus === FETCH_STATUS.LOADING}
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
      <View style={styles.buttons}>
        <IconButton icon="close" iconColor={theme.colors.secondary} size={20} onPress={onClose} />
        <IconButton
          loading={updateCurrentUserStatus === FETCH_STATUS.LOADING}
          icon="check"
          iconColor={theme.colors.primary}
          size={20}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
