import * as React from "react";
import { Pie } from 'react-chartjs-2';
import { IPieChartProps } from './IPieChartProps';

export default function PieChart (props: IPieChartProps) {
  return (<div><Pie
    data={props.chartData}
    options={{
      legend: {
        display: false,
    }
    }}
/></div>);
}