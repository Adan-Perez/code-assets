import axios from 'axios';
import { load } from 'cheerio';

const getHtml = async (url: string) => {
  const { data: html } = await axios.get(url);
  return html;
};

const getBaseUrl = (url: string) => {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.host}/`;
};

const getMetaData = async (url: string) => {
  const baseUrl = getBaseUrl(url);
  const html = await getHtml(baseUrl);
  const $ = load(html);

  const cleanText = (text: string) => text.replace(/\s\s+/g, ' ').trim();

  let title = cleanText($('title').text()) || 'No title found';
  let description =
    cleanText($('meta[name="description"]').attr('content') || '') ||
    'No description found';
  let favicon =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    '/favicon.ico';

  if (favicon && !favicon.startsWith('http')) {
    favicon = `${baseUrl}${favicon}`;
  }

  return { baseUrl, title, description, favicon };
};

const handler = async (req: any, res: any) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const metadata = await getMetaData(url);
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
};

export default handler;
