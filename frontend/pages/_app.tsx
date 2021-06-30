import type { AppProps } from "next/app";
import { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;
