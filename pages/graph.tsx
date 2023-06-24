import { NextPage } from "next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { chartData } from './testData';


const Graph: NextPage = () => {
  return (
    <div>
      <p>new chart</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" type="number" />
          <YAxis dataKey="fps" />
          <Tooltip />
          <Legend />
          {chartData.forEach((feedEvents, user) => {
            console.log("****************", user, '  ', feedEvents);
            <Line type="monotone" dataKey="fps" data={feedEvents} key={user} name={user}/>
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
