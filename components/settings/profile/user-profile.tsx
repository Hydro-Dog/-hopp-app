import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { FETCH_STATUS } from "@/shared";
import { ChoppViewItems } from "@/shared/components/chopp-view-items";
import { formatPhoneNumber } from "@/shared/utils/format-phone-number";
import { User } from "@/store/slices/user-slice/index";
import { RootState } from "@/store/store";

const KEYS: (keyof User)[] = ["fullName", "phoneNumber", "email"];

type Props = {
  user?: User;
  setEditMode?: () => void;
};

export const UserProfile = ({ user, setEditMode }: Props) => {
  const { t } = useTranslation();
  const { currentUser, fetchCurrentUserStatus } = useSelector((state: RootState) => state.user);

  const formattedUser = {
    ...currentUser,
    phoneNumber: formatPhoneNumber(currentUser?.phoneNumber),
  };

  return (
    <View style={styles.container}>
      <ChoppViewItems
        loading={fetchCurrentUserStatus === FETCH_STATUS.LOADING || fetchCurrentUserStatus === FETCH_STATUS.IDLE}
        items={KEYS.reduce((acc, key) => ({ ...acc, [t(key)]: formattedUser?.[key] }), {})}
      />
      <Button mode="contained" onPress={setEditMode}>
        {t("edit")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  items: {
    gap: 16,
  },
});
