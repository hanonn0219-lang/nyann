
const { readBody, toBase64 } = require('../_utils');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // API key check
  const apiKeyHeader = req.headers['x-api-key'];
  const expected = process.env.LEARNINGOPS_API_KEY || '';
  if (!expected || apiKeyHeader !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Parse JSON body
  let bodyText = await readBody(req);
  let body;
  try { body = JSON.parse(bodyText || '{}'); }
  catch { res.status(400).json({ error: 'Invalid JSON' }); return; }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    res.status(400).json({ error: 'No flashcard items' });
    return;
  }
  if (items.length > 12) {
    res.status(400).json({ error: 'Max 12 items' });
    return;
  }

  // Prepare token for stateless file endpoints
  const token = toBase64({ items, ts: Date.now() });
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = req.headers.host;
  const baseUrl = process.env.BASE_URL || `${proto}://${host}`;

  const csvUrl = `${baseUrl}/api/v1/files.csv?d=${token}`;
  const pdfUrl = `${baseUrl}/api/v1/files.pdf?d=${token}`;

  res.status(200).json({
    csv_url: csvUrl,
    pdf_url: pdfUrl
  });
};
