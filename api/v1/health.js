
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok', uptimeSec: Math.round(process.uptime()) });
};
