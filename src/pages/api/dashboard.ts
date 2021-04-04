import { NextApiRequest, NextApiResponse } from 'next';
import { ChartData } from '../../components/Chart';
import { Order } from '../../components/Orders';

export interface DashBoardApiResponse {
  chart: ChartData[];
  deposits: { amount: number; date: string };
  orders: Order[];
}

// Generate Sales Data
function createData(time: string, amount: number | undefined) {
  return { time, amount };
}

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

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<DashBoardApiResponse>
) {
  const body = {
    chart: chartData,
    orders,
    deposits,
  };
  res.status(200).json(body);
}
