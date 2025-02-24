import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useBoolean } from "usehooks-ts";
import { z } from "zod";
import { useLoginFormSchema } from "./hooks";
import { LoginType } from "./types";
import { ChoppFormField } from "@/shared/components/chopp-form-field";
import { useChoppSnackbar, SNACKBAR_VARIANTS } from "@/shared/components/chopp-snackbar-stack";
import { useAuthContext } from "@/shared/context/auth-context";
import { useChoppTheme } from "@/shared/context/chopp-theme-context";
import { FETCH_STATUS } from "@/shared/types/fetch-status";
import { ErrorResponse } from "@/shared/types/response-error";
import { addToStorage } from "@/shared/utils/async-storage-methods";
import { formatPhoneNumber } from "@/shared/utils/format-phone-number";
import { login, UserLoginDTO } from "@/store/slices/user-slice/index";
import { RootState, AppDispatch } from "@/store/store";

export const LoginForm = () => {
  const { setAuth, setIsAsyncStorageLoaded } = useAuthContext();
  const { theme } = useChoppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { value: passwordVisible, toggle: togglePasswordVisibility } = useBoolean();
  const { loginStatus } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { pushNewNotification } = useChoppSnackbar();

  const [loginType, setLoginType] = useState<LoginType>(LoginType.EMAIL);
  const isEmailLoginType = loginType === LoginType.EMAIL;

  const loginSchema = useLoginFormSchema(loginType);
  type LoginFormType = z.infer<typeof loginSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      phoneNumber: "",
      email: "",
    },
  });

  const handleChangeLoginType = () => {
    if (isEmailLoginType) {
      setLoginType(LoginType.PHONE_NUMBER);
    } else {
      setLoginType(LoginType.EMAIL);
    }
  };

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    try {
      setIsAsyncStorageLoaded?.(false);

      const res = await dispatch(login(data as unknown as UserLoginDTO)).unwrap();

      setAuth?.(res);

      await addToStorage("accessToken", res.accessToken);
      await addToStorage("refreshToken", res.refreshToken);

      setIsAsyncStorageLoaded?.(true);

      router.push("/");
    } catch (error: unknown) {
      pushNewNotification({
        id: String(Math.random()),
        variant: SNACKBAR_VARIANTS.ERROR,
        text: t(`serverErrors.${(error as ErrorResponse).message}`) || JSON.stringify(error as ErrorResponse),
      });
    }
  };

  return (
    <View>
      {isEmailLoginType && (
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
      )}

      {!isEmailLoginType && (
        <ChoppFormField errorMessage={errors.phoneNumber?.message}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
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
      )}

      <ChoppFormField errorMessage={errors.password?.message} styles={{ width: "" }}>
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

      <Button
        mode="contained"
        style={styles.loginButton}
        loading={loginStatus === FETCH_STATUS.LOADING}
        disabled={loginStatus === FETCH_STATUS.LOADING}
        onPress={handleSubmit(onSubmit)}
      >
        {t("actions.signIn")}
      </Button>

      <Button mode="outlined" style={styles.loginTypeButton} onPress={handleChangeLoginType}>
        {isEmailLoginType ? t("actions.byPhoneNumber") : t("actions.byEmail")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    marginTop: 24,
  },
  loginTypeButton: {
    marginTop: 20,
  },
});
