// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
}

const rpc = "https://nd-423-043-412.p2pify.com/4827e847837107fdd7166679b047c668";

const jsonToHTMLHelp = (json: { [keyof: string]: string }) => {
  return Object.keys(json).map(k => {
    return `<p>
      <span class="key">${k}:</sapn>
      <span class="value">${json[k]}</sapn>
    </p>`
  }).join("")
}

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
    res.send(jsonToHTMLHelp({
      "status": "error",
      "error": "fetch error, polygon rpc node is not down",
    }));
    res.status(fetchres.status).end();
    return;
  }

  const data = await fetchres.json();
  if (data.result.currentBlock) {
    res.status(500).send(jsonToHTMLHelp(
      {
        status: "syning",
        msg: "working on synchronizing the latest blocks",
        isSyncing: `${data.result.currentBlock !== data.result.highestBlock}`,
        currentBlock: `${parseInt(data.result.currentBlock)}`,
        highestBlock: `${parseInt(data.result.highestBlock)}`,
        diffBlock: `${data.result.highestBlock - data.result.currentBlock}`,
      }
    ))
    res.end();
    return
  }

  res.send(jsonToHTMLHelp({
    "status": "normal",
    "msg": "polygon rpc node is runing",
  }));
  res.status(200).end();
}
