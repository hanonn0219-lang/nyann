
const { fromBase64 } = require('../_utils');
const PDFDocument = require('pdfkit');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const d = (req.query && req.query.d) || (req.url.split('?d=')[1] || '');
  if (!d) { res.status(400).send('Missing d'); return; }

  let payload;
  try { payload = fromBase64(d); }
  catch { res.status(400).send('Bad token'); return; }

  const items = Array.isArray(payload.items) ? payload.items : [];

  // Create PDF
  const doc = new PDFDocument({ size: 'A4', margin: 36 }); // 0.5 inch margin
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="flashcards.pdf"');
  doc.pipe(res);

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;

  const cols = 3, rows = 3; // up to 9 per page; if >9, continue on next page
  const cellW = pageWidth / cols;
  const cellH = pageHeight / rows;

  let idx = 0;
  for (let i = 0; i < items.length; i++) {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    if (row >= rows) {
      doc.addPage();
      idx = 0;
    }
    const x = doc.page.margins.left + (idx % cols) * cellW;
    const y = doc.page.margins.top + Math.floor(idx / cols) * cellH;

    // Card border
    doc.rect(x + 6, y + 6, cellW - 12, cellH - 12).stroke();

    // Text
    const en = String(items[i].english || '');
    const ja = String(items[i].japanese || '');
    const ipa = items[i].ipa ? String(items[i].ipa) : '';
    const ex = items[i].example ? String(items[i].example) : '';

    doc.fontSize(16).text(en, x + 16, y + 18, { width: cellW - 32, align: 'left' });
    if (ipa) doc.fontSize(10).fillColor('#555').text(ipa, x + 16, y + 40, { width: cellW - 32 });
    doc.fontSize(12).fillColor('#000').text(ja, x + 16, y + 60, { width: cellW - 32 });
    if (ex) doc.fontSize(10).fillColor('#333').text('ex: ' + ex, x + 16, y + 80, { width: cellW - 32 });

    idx++;
  }

  doc.end();
};
