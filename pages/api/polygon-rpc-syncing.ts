// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
}

const rpc = "https://bor-rpc-fast2-polygon.melandworld.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const fetchres = await fetch(rpc, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_syncing",
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!fetchres.ok) {
    res.status(fetchres.status).end();
    return;
  }

  const data = await fetchres.json();
  if (data.result.currentBlock) {
    res.status(500).json({
      isSyncing: data.result.currentBlock !== data.result.highestBlock,
      currentBlock: data.result.currentBlock,
      highestBlock: data.result.highestBlock,
      diffBlock: data.result.highestBlock - data.result.currentBlock,
    });
    res.end();
    return
  }

  res.write(JSON.stringify(data));
  res.status(200).end();
}
