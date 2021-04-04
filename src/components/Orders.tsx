import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { Skeleton } from '@material-ui/lab';

function preventDefault(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export interface Order {
  id: number;
  date: string;
  name: string;
  shipTo: string;
  paymentMethod: string;
  amount: number;
}

interface OrdersProps {
  loading: boolean;
  orders: Order[];
}

export const Orders: React.FC<OrdersProps> = (props) => {
  const classes = useStyles();
  if (props.loading) {
    return (
      <>
        <Title>Recent Orders</Title>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  }
  return (
    <>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.shipTo}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell align="right">{order.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </>
  );
};
