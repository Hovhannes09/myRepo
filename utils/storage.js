import fs from 'fs/promises';

const DATA_DIR = './data';

async function ensureFile(fileName) {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR);
  }

  const filePath = `${DATA_DIR}/${fileName}`;

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf-8');
  }

  return filePath;
}

async function read(fileName) {
  try {
    const filePath = await ensureFile(fileName);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function write(fileName, items) {
  const filePath = await ensureFile(fileName);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf-8');
}

async function add(fileName, item) {
  const data = await read(fileName);
  data.push(item);
  await write(fileName, data);
  return item;
}

export default { read, write, add };