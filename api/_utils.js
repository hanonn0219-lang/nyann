
function readBody(req) {
  return new Promise((resolve, reject) => {
    try {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

function toBase64(obj) {
  const json = JSON.stringify(obj);
  const b64 = Buffer.from(json).toString('base64');
  return encodeURIComponent(b64);
}

function fromBase64(str) {
  const json = Buffer.from(decodeURIComponent(str), 'base64').toString('utf8');
  return JSON.parse(json);
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

module.exports = { readBody, toBase64, fromBase64, csvEscape };
