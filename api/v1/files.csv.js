
const { fromBase64, csvEscape } = require('../_utils');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const d = (req.query && req.query.d) || (req.url.split('?d=')[1] || '');
  if (!d) { res.status(400).send('Missing d'); return; }

  let payload;
  try { payload = fromBase64(d); }
  catch { res.status(400).send('Bad token'); return; }

  const items = Array.isArray(payload.items) ? payload.items : [];

  // Build CSV
  const header = ['english','japanese','ipa','example'];
  let lines = [header.join(',')];
  for (const it of items) {
    const row = [
      csvEscape(it.english || ''),
      csvEscape(it.japanese || ''),
      csvEscape(it.ipa || ''),
      csvEscape(it.example || '')
    ];
    lines.push(row.join(','));
  }
  const csv = lines.join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="flashcards.csv"');
  res.status(200).send(csv);
};
