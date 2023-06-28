import { NextPage } from "next";
import { TooltipItem, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale, Chart, Tooltip } from "chart.js";
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { chartData } from '../testData';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

Chart.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, TimeSeriesScale, Tooltip);

function toolTipLabel(context: TooltipItem<'line'>) {
  const item = context.raw;
  return JSON.stringify(item, null, 2);
}

const Graph: NextPage = () => {
  return (
    <Box height="calc(100vh - 64px)" width="100%">
      <Container maxWidth={false} className="homePageLinkContainer" style={{ height: '100%', width: '100%' }}>
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
            plugins: {
              tooltip: {
                callbacks: {
                  label: toolTipLabel
                }
              }
            },
            maintainAspectRatio: false
          }}
        />
      </Container>
    </Box>
  );
};

export default Graph;
