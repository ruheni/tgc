import { NextPage } from "next";
import { Line } from 'react-chargjs-2';
import { testData } from './testData';

export type FeedEvent = {
  id: number
  user: string
  fps: number
  timestamp: number
  event: string
  description: string
}

const Graph: NextPage = () => {
  return (
    <div>
      Render Graph Here!
    </div>
  );
};

export default Graph;
