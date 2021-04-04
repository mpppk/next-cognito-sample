import { NextPage } from 'next';
import React from 'react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { User } from '../models/models';
import { awsconfig } from '../awsconfig';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from '@aws-amplify/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, LinearProgress, Paper } from '@material-ui/core';
import { Deposits } from '../components/Deposits';
import { Orders } from '../components/Orders';
import { Copyright } from '@material-ui/icons';
import clsx from 'clsx';
import { Chart } from '../components/Chart';
import { useQuery } from 'react-query';
import { DashBoardApiResponse } from './api/dashboard';
import { sleep } from '../util';

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
  loading: {
    height: 10,
  },
}));

interface ProgressProps {
  loading: boolean;
}

const Progress: React.FC<ProgressProps> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      {props.loading ? <LinearProgress /> : null}
    </div>
  );
};

// tslint:disable-next-line variable-name
export const Index: NextPage = () => {
  const classes = useStyles();
  const query = useQuery(
    'dashboard',
    async (): Promise<DashBoardApiResponse> => {
      const res = await fetch('/api/dashboard');
      await sleep(3000);
      return res.json();
    }
  );

  const [authState, setAuthState] = React.useState<AuthState>();
  const [user, setUser] = React.useState<User | undefined>();

  const chartData = query.data?.chart ?? [];
  const deposits = query.data?.deposits ?? { amount: 0, date: '' };
  const orders = query.data?.orders ?? [];

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as User | undefined);
    });
  }, []);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return authState === AuthState.SignedIn && user ? (
    <>
      <Progress loading={query.isLoading} />
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart loading={query.isLoading} data={chartData} />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits {...deposits} loading={query.isLoading} />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Orders orders={orders} loading={query.isLoading} />
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
