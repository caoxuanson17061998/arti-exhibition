import Config from "../config";
import store, {persistor} from "../redux/store";
import Routes from "../routes";
import "../styles/_app.scss";
import {redRose} from "../styles/fonts";
import "../utils/I18n";
import "../utils/firebase";
import HeaderMeta from "@components/HeaderMeta";
import {ConfigProvider} from "antd";
import {AppProps} from "next/app";
import {QueryClient, QueryClientProvider} from "react-query";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import "tailwindcss/tailwind.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Config.NETWORK_CONFIG.RETRY,
      refetchOnWindowFocus: false,
    },
  },
});

export default function MyApp({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element {
  if (typeof window !== "undefined") {
    return (
      <div className={redRose.className}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <HeaderMeta title="ART EXHIBITION" description="ART EXHIBITION" />
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily: redRose.style.fontFamily,
                  },
                }}
              >
                <Routes
                  Component={Component}
                  pageProps={pageProps}
                  router={router}
                />
              </ConfigProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </div>
    );
  }

  return (
    <div className={redRose.className}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <HeaderMeta title="ART EXHIBITION" description="ART EXHIBITION" />
          <Routes Component={Component} pageProps={pageProps} router={router} />
        </QueryClientProvider>
      </Provider>
    </div>
  );
}
