import { NextPage } from 'next';
import React from 'react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { User } from '../models/models';
import { awsconfig } from '../awsconfig';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from '@aws-amplify/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper } from '@material-ui/core';
import Deposits from '../components/Deposits';
import Orders from '../components/Orders';
import { Copyright } from '@material-ui/icons';
import Chart from '../components/Chart';
import clsx from 'clsx';

Amplify.configure(awsconfig);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

// tslint:disable-next-line variable-name
export const Index: NextPage = () => {
  const classes = useStyles();

  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<User | undefined>();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as User | undefined);
    });
  }, []);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return authState === AuthState.SignedIn && user ? (
    <>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </>
  ) : (
    <AmplifyAuthenticator />
  );
};

export default Index;
