import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { ErrorResponse } from "../types";
import { AppDispatch } from "@/store/store";

type Args<R, A> = {
  action: AsyncThunkAction<R, A, { rejectValue: ErrorResponse }>;
  thenHandler?: (value: R) => void;
  catchHandler?: (error: ErrorResponse) => void;
};

export const useSuperDispatch = <R, A>() => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  // TODO: заменить на местный контекст нотификаций
  // const { showErrorNotification } = useNotificationContext();

  const defaultErrorHandler = (error: ErrorResponse) => {
    // showErrorNotification({
    //   message: t("Error"),
    //   description: error?.message,
    // });
  };

  return {
    superDispatch: ({ action, thenHandler, catchHandler }: Args<R, A>) =>
      dispatch(action)
        .unwrap()
        .then(thenHandler)
        .catch(catchHandler || defaultErrorHandler),
  };
};
