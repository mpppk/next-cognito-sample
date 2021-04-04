import { Container } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { AppProps } from 'next/app';
import React, { FC } from 'react';
import { MyAppBar } from '../components/AppBar';
import { wrapper } from '../store';
import theme from '../theme';
import { makeStyles } from '@material-ui/core/styles';
import { QueryClient, QueryClientProvider } from 'react-query';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const queryClient = new QueryClient();

// tslint:disable-next-line variable-name
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const classes = useStyles();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <MyAppBar />

          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Component {...pageProps} />
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default wrapper.withRedux(WrappedApp);
