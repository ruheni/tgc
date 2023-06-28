import { ChartData } from 'chart.js';

export type FeedEvent = {
  id: number
  user: string
  fps: number
  timestamp: number
  event: string
  description: string
}

export const testData: FeedEvent[] = [
  {
    "id": 0,
    "user": "david",
    "fps": 25,
    "timestamp": 1652827090,
    "event": "item_purchase",
    "description": "season_pass"
  },
  {
    "id": 1,
    "user": "david",
    "fps": 25,
    "timestamp": 1652827000,
    "event": "item_purchase",
    "description": "candle"
  },
  {
    "id": 2,
    "user": "david",
    "fps": 30,
    "timestamp": 1652827420,
    "event": "add_friend",
    "description": "James"
  },
  {
    "id": 3,
    "user": "david",
    "fps": 29,
    "timestamp": 1652827400,
    "event": "enter_level",
    "description": "Level_Archives"
  },
  {
    "id": 4,
    "user": "david",
    "fps": 31,
    "timestamp": 1652827060,
    "event": "ping",
    "description": ""
  },
  {
    "id": 5,
    "user": "david",
    "fps": 29,
    "timestamp": 1652827160,
    "event": "enter_level",
    "description": "Level_Rain"
  },
  {
    "id": 6,
    "user": "david",
    "fps": 27,
    "timestamp": 1652827480,
    "event": "ping",
    "description": ""
  },
  {
    "id": 7,
    "user": "david",
    "fps": 30,
    "timestamp": 1652827300,
    "event": "ping",
    "description": ""
  },
  {
    "id": 8,
    "user": "david",
    "fps": 25,
    "timestamp": 1652827320,
    "event": "item_purchase",
    "description": "candle"
  },
  {
    "id": 9,
    "user": "david",
    "fps": 30,
    "timestamp": 1652827425,
    "event": "add_party",
    "description": "James"
  },
  {
    "id": 10,
    "user": "James",
    "fps": 60,
    "timestamp": 1652827425,
    "event": "add_party",
    "description": "david"
  },
  {
    "id": 11,
    "user": "James",
    "fps": 59,
    "timestamp": 1652827500,
    "event": "ping",
    "description": ""
  }
]

const stringToColour = (str: string) => {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return colour
}

function feedEventsByUser(testData: FeedEvent[]) {
  return testData.reduce((acc, feedEvent) => {
    if (!acc.has(feedEvent.user)) {
      acc.set(feedEvent.user, [])
    }
    acc.get(feedEvent.user)?.push(feedEvent);
    return acc;
  }, new Map<string, FeedEvent[]>());
}

export const chartData: ChartData<'line', FeedEvent[]> = {
  datasets: Array.from(feedEventsByUser(testData).entries()).map(([user, feedEvent]) => {
    const userColor = stringToColour(user);
    return {
      label: user,
      data: feedEvent.map(event => ({ ...event, timestamp: event.timestamp * 1000 })).sort((a, b) => a.timestamp - b.timestamp),
      parsing: {
        xAxisKey: "timestamp",
        yAxisKey: "fps"
      },
      backgroundColor: userColor,
      borderColor: userColor
    };
  })
}
