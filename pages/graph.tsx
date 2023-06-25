import { NextPage } from "next";
import { TooltipItem, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale, Chart, Tooltip } from "chart.js";
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { FeedEvent, chartData } from './testData';

Chart.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, TimeSeriesScale, Tooltip);

function toolTipLabel(context: TooltipItem<'line'>){
  const item = context.raw;
  return JSON.stringify(item, null, 2);
}

const Graph: NextPage = () => {
  return (
    <div>
      <Line
        data={chartData}
        options={{
          scales: {
            x: {
              type: 'time',
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
          },
          plugins:{
            tooltip:{
              callbacks:{
                label: toolTipLabel
              }
            }
          }
        }}
      />
    </div>
  );
};

export default Graph;
