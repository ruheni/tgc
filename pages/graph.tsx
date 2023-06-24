import { NextPage } from "next";
import { CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale, Chart, Tooltip } from "chart.js";
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { chartData } from './testData';

Chart.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, TimeSeriesScale, Tooltip);

const Graph: NextPage = () => {
  return (
    <div>
      <Line
        data={chartData}
        options={{
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute'
              },
              title: {
                display: true,
                text: 'Timestamp',
              },
            },
            y: {
              title: {
                display: true,
                text: 'FPS'
              }
            }
          }
        }}
      />
    </div>
  );
};

export default Graph;
