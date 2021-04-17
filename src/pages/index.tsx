import { NextPage } from 'next';
import React from 'react';
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
import { NeedLogin } from '../components/NeedLogin';
import { Session } from '../models/models';

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

interface Props {
  session: Session;
}

export const Index: NextPage<Props> = (props) => {
  const classes = useStyles();
  const { user, authState } = props.session;
  const query = useQuery(
    'dashboard',
    async (): Promise<DashBoardApiResponse> => {
      const res = await fetch('/api/dashboard');
      await sleep(3000);
      return res.json();
    }
  );

  const chartData = query.data?.chart ?? [];
  const deposits = query.data?.deposits ?? { amount: 0, date: '' };
  const orders = query.data?.orders ?? [];

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <NeedLogin user={user} authState={authState}>
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
    </NeedLogin>
  );
};

export default Index;
