import { NextPage } from 'next';
import React from 'react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { User } from '../models/models';
import { awsconfig } from '../awsconfig';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from '@aws-amplify/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper } from '@material-ui/core';
import { Deposits } from '../components/Deposits';
import { Orders } from '../components/Orders';
import { Copyright } from '@material-ui/icons';
import clsx from 'clsx';
import { Chart, ChartData } from '../components/Chart';

Amplify.configure(awsconfig);

// Generate Sales Data
function createData(time: string, amount: number | undefined) {
  return { time, amount };
}

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

const chartData: ChartData[] = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

const deposits = { amount: 3024, date: '15 March, 2019' };

// Generate Order Data
function createOrder(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const orders = [
  createOrder(
    0,
    '16 Mar, 2019',
    'Elvis Presley',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44
  ),
  createOrder(
    1,
    '16 Mar, 2019',
    'Paul McCartney',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99
  ),
  createOrder(
    2,
    '16 Mar, 2019',
    'Tom Scholz',
    'Boston, MA',
    'MC ⠀•••• 1253',
    100.81
  ),
  createOrder(
    3,
    '16 Mar, 2019',
    'Michael Jackson',
    'Gary, IN',
    'AMEX ⠀•••• 2000',
    654.39
  ),
  createOrder(
    4,
    '15 Mar, 2019',
    'Bruce Springsteen',
    'Long Branch, NJ',
    'VISA ⠀•••• 5919',
    212.79
  ),
];

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
            <Chart data={chartData} />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits {...deposits} />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Orders orders={orders} />
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
