import { useState } from "react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet } from "react-native";
import { Banner, Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoolean } from "usehooks-ts";
import { OrderAdditionalInfoFormSchema, OrderAdditionalInfoFormType } from "./types";
import { ChoppFormField, ChoppThemedText, Order, useSuperDispatch } from "@/shared";
import { createOrder } from "@/store/slices/order-slice";
import { CreateOrderDTO } from "@/store/slices/order-slice/types";
import { resetShoppingCart } from "@/store/slices/shopping-cart-slice";

type Props = {
  onClose: () => void;
};

export const OrderAdditionalInfoForm = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { superDispatch } = useSuperDispatch<Order, unknown>();
  const { value: isBannerVisible, setTrue: showBanner, setFalse: hideBanner } = useBoolean();
  const [bannerMessage, setBannerMessage] = useState("");
  const dispatch = useDispatch();

  const onCommitOrder = ({ comment, address }: OrderAdditionalInfoFormType) => {
    superDispatch({
      action: createOrder({ comment, address } as CreateOrderDTO),
      thenHandler: (order) => {
        dispatch(resetShoppingCart());
        Linking.openURL(order.paymentUrl).catch((err) => console.error("Ошибка открытия ссылки:", err));
        onClose();
      },
      catchHandler: (err) => {
        setBannerMessage(err.message);
        showBanner();
      },
    });
  };

  const onHideBannerPress = () => {
    hideBanner();
    setBannerMessage("");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderAdditionalInfoFormType>({
    resolver: zodResolver(OrderAdditionalInfoFormSchema(t)),
    defaultValues: {
      address: "",
      comment: "",
    },
  });

  return (
    <>
      <ChoppFormField errorMessage={errors.comment?.message}>
        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label={t("comment")}
              value={value}
              onBlur={onBlur}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={onChange}
              error={!!errors.comment}
            />
          )}
        />
      </ChoppFormField>

      <ChoppFormField errorMessage={errors.address?.message} styles={{ width: "" }}>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label={t("address")}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.address}
            />
          )}
        />
      </ChoppFormField>

      <Banner
        visible={isBannerVisible}
        actions={[
          {
            label: t("ok"),
            onPress: onHideBannerPress,
          },
        ]}
      >
        <ChoppThemedText>{bannerMessage}</ChoppThemedText>
      </Banner>

      <Button mode="contained" style={styles.saveButton} onPress={handleSubmit(onCommitOrder)}>
        {t("makePayment")}
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    marginVertical: 10,
    alignSelf: "flex-end",
  },
});
