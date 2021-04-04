import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import Skeleton from '@material-ui/lab/Skeleton';

export interface ChartData {
  time: string;
  amount: number | undefined;
}

interface ChartProps {
  data: ChartData[];
  loading: boolean;
}

export const Chart: React.FC<ChartProps> = (props) => {
  const theme = useTheme();

  if (props.loading) {
    return (
      <>
        <Title>Today</Title>
        <ResponsiveContainer>
          <Skeleton variant="rect" />
        </ResponsiveContainer>
      </>
    );
  }

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={props.data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};
