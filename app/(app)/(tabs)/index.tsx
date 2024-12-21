/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  useColorScheme,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar, Searchbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ProductGridItem, CategoryTabs } from "@/components/main";
import { COLORS } from "@/constants/colors";
import { CONFIG } from "@/my-config";

import {
  FETCH_STATUS,
  ChoppScreenLayout,
  Pagination,
  useSuperDispatch,
} from "@/shared";
import { fetchProducts, Product } from "@/store/slices/product-slice";
import { AppDispatch, RootState } from "@/store/store";
import { ru } from "@/translation/ru";

const { Header } = Appbar;

const LIMIT = 8;
const FIRST_PAGE_NUMBER = 1;

const theme = useColorScheme() ?? "light";

export default function TabHome() {
  const dispatch = useDispatch<AppDispatch>();
  const superDispatch = useSuperDispatch();
  const [pageProducts, setPageProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Partial<Pagination>>();
  const { fetchProductsStatus, products } = useSelector(
    (state: RootState) => state.products,
  );
  const [chosenCategory, setChosenCategory] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    dispatch(
      fetchProducts({
        categoryId: chosenCategory,
        limit: LIMIT,
        pageNumber: FIRST_PAGE_NUMBER,
        search: searchQuery,
      }),
    );
    console.log(products);

    setPagination({
      limit: LIMIT,
      pageNumber: FIRST_PAGE_NUMBER,
    });
  }, [dispatch, searchQuery, chosenCategory]);

  useEffect(() => {
    setPageProducts(products?.items || []);
  }, [products]);

  const onLoadMore = () => {
    if (fetchProductsStatus === FETCH_STATUS.LOADING) return;
    superDispatch({
      action: fetchProducts({
        categoryId: chosenCategory,
        limit: pagination?.limit,
        pageNumber: pagination?.pageNumber + 1,
        search: searchQuery,
      }),
      thenHandler: (response) => {
        setPageProducts([...pageProducts, ...(response.items || [])]);
        setPagination({
          ...pagination,
          pageNumber: pagination?.pageNumber + 1,
        });
      },
    });
    console.log(products?.totalItems, pageProducts.length);
  };
  return (
    <>
      <Appbar.Header style={{ height: 130 }}>
        <View
          style={{
            flex: 1,
            zIndex: 1,
          }}
        >
          <View style={styles.centering}>
            <Searchbar
              placeholder={ru.search}
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.search}
              inputStyle={{ paddingBottom: 10 }} //Знаю что кастыль но почему-то ширина именно инпут поля изменяться не хочет вообще
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <CategoryTabs
              chosenCategory={chosenCategory}
              setChosenCategory={setChosenCategory}
            />
          </ScrollView>
        </View>
      </Appbar.Header>
      <ChoppScreenLayout loading={fetchProductsStatus === FETCH_STATUS.LOADING}>
        <View style={styles.container}>
          {/* TODO: Этот экран (CallStatusScreen + CurrentOrderDetails) мы перенесем куда-нибудь в другое место.
             Типа в статус заказа   */}
          {/* {currentOrderData ? (
              <>
                <CallStatusScreen
                  currentStatus={currentOrderData?.statusData?.status}
                  timeStamp={currentOrderData?.statusData?.timeStamp}
                />

                <CurrentOrderDetails order={currentOrderData} />
              </>
            ) : ( */}
          <>
            <FlatList
              data={pageProducts}
              keyExtractor={(item) => item.title}
              numColumns={2}
              onEndReached={() =>
                pageProducts.length !== products?.totalItems && onLoadMore()
              }
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <ProductGridItem
                  title={item.title}
                  imagePath={CONFIG.filesUrl + item.images?.[0]?.path}
                  price={String(item.price)}
                />
              )}
            />
          </>
          {/* )} */}
        </View>
      </ChoppScreenLayout>
      {/* <KeyboardAwareScrollView>
        
      </KeyboardAwareScrollView> */}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    //paddingBottom: 64,
    alignItems: "center",
  },
  search: {
    backgroundColor: COLORS.light.onPrimary,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: COLORS.light.primaryContainer,
    width: "95%",
    height: 50,
  },
  centering: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  logo: {
    width: 128,
    height: 128,
  },
  content: {
    width: "100%",
  },
  loginButton: {
    marginTop: 20,
    width: "100%",
  },
  activityIndicator: {
    position: "absolute",
    top: 40,
    right: 40,
  },
});
