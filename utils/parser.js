export async function jsonBodyParser(req) {
  if (req.headers['content-type'] !== 'application/json') {
    return {};
  }

  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(JSON.parse(body));
    })

    req.on('error', (err) => {
      reject(err);
    })
  })
}

export function queryParser(req) {
  const { pathname: url, searchParams } = new URL(`http://localhost:8080${req.url}`);

  const query = Object.fromEntries(searchParams);

  return { query, url, method: req.method };
}

export async function parser(req) {
  const { query, url, method } = queryParser(req)

  let body = {};

  if (['POST', 'PUT'].includes(method)) {
    body = await jsonBodyParser(req)
  }

  req.query = query;
  req.body = body;
  req.url = url;

  return req
}

export default parser;