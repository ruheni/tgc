// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export type Post = {
  author: string
  body: string
};

export type PostAPIResponse = {
  post?: Post
  message?: string
};

const RESTHandlers = {
  'POST': function (req, res) {
    res.status(200).json({ post: { author: "", body: "" } })
  },
  'GET': function (req, res) {
    res.status(200).json({ post: { author: "", body: "" } })
  },

  'DELETE': function (req, res) {
    res.status(200).json({ message: "post deleted" });
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (RESHandlers[req.method]) {
    return RESTHandlers[req.method](req, res)
  } else {
    res.status(500).json({ message: "Unsupported method for Post record" });
  }

  // Implement rest endpoints for getting, creating, and posting 'posts'.

}
