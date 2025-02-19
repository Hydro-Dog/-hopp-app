/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import { Snackbar } from "react-native-paper";
import { useChoppTheme } from "../context/chopp-theme-context";

type ChoppSnackbarContextType = {
  pushNewNotification: (item: ChoppSnackbarProps) => void;
};

export const ChoppSnackbarContext = createContext<ChoppSnackbarContextType>({
  pushNewNotification: function (item: ChoppSnackbarProps): void {
    throw new Error("Function not implemented.");
  },
});

export enum SNACKBAR_VARIANTS {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  SUCCESS = "success",
  DEFAULT = "default",
}

export const useChoppSnackbar = () => useContext(ChoppSnackbarContext);

type ChoppSnackbarProps = {
  id: string;
  variant: SNACKBAR_VARIANTS;
  text: string;
  actionLabel?: string;
  duration?: number;
  onActionPress?: (value: ChoppSnackbarProps) => void;
};

//TODO: Добиться плавного исчезновения снакбаров для нативности
export const ChoppSnackbarStack = ({ children }: PropsWithChildren<object>) => {
  const { theme } = useChoppTheme();
  const [snackbarMessages, setSnackbarMessages] = useState<Record<string, ChoppSnackbarProps>>({});

  //TODO: сделать дефолтный таймер на 3с
  const pushSnackbar = (item: ChoppSnackbarProps) => {
    setSnackbarMessages((val) => ({ ...val, [item.id]: item }));
  };

  const popSnackbar = (itemId: string) => {
    setSnackbarMessages((val) => {
      delete val[itemId];
      return { ...val };
    });
  };

  const snackbarColors: Record<string, { background: string; color: string }> = {
    [SNACKBAR_VARIANTS.DEFAULT]: {
      background: theme.colors.primaryContainer,
      color: theme.colors.onPrimaryContainer,
    },
    [SNACKBAR_VARIANTS.INFO]: {
      background: theme.colors.secondaryContainer,
      color: theme.colors.onSecondaryContainer,
    },
    [SNACKBAR_VARIANTS.ERROR]: {
      background: theme.colors.errorContainer,
      color: theme.colors.onErrorContainer,
    },
    [SNACKBAR_VARIANTS.WARN]: {
      background: theme.colors.tertiaryContainer,
      color: theme.colors.onTertiaryContainer,
    },
    [SNACKBAR_VARIANTS.SUCCESS]: {
      background: theme.colors.successContainer,
      color: theme.colors.onSuccessContainer,
    },
  };

  return (
    <ChoppSnackbarContext.Provider value={{ pushNewNotification: pushSnackbar }}>
      {children}
      <View>
        {Object.values(snackbarMessages)?.map((item, index) => {
          console.log("item.duration: ", item, item.duration, item.duration || 3000);
          return (
            <Snackbar
              duration={item.duration || 3000}
              key={index}
              style={{
                backgroundColor: snackbarColors[item.variant].background,
                top: (Object.values(snackbarMessages).length - index) * -30,
                opacity: 0.95,
              }}
              visible
              onDismiss={() => popSnackbar(item.id)}
              action={{
                textColor: snackbarColors[item.variant].color,
                label: item?.actionLabel || "╳",
                onPress: () => {
                  if (item?.onActionPress) {
                    item.onActionPress(item);
                  } else {
                    popSnackbar(item.id);
                  }
                },
              }}
            >
              <Text style={{ color: snackbarColors[item.variant].color }}>{item.text}</Text>
            </Snackbar>
          );
        })}
      </View>
    </ChoppSnackbarContext.Provider>
  );
};
