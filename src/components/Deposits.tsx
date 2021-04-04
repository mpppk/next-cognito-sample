import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { Skeleton } from '@material-ui/lab';

function preventDefault(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export interface DepositsProps {
  loading: boolean;
  amount: number;
  date: string;
}

export const Deposits: React.FC<DepositsProps> = (props) => {
  const classes = useStyles();
  if (props.loading) {
    return (
      <>
        <Title>Recent Deposits</Title>
        <Skeleton />
        <Skeleton width="60%" />
      </>
    );
  }
  return (
    <>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        ${props.amount.toLocaleString()}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {props.date}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </>
  );
};
