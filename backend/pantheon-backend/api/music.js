import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'muses-music.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const musicData = JSON.parse(data);
    res.status(200).json(musicData);
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).send('Server Error');
  }
}
