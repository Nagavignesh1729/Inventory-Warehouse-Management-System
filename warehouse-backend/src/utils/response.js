exports.success = (res, data = {}, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });

exports.error = (res, message = 'Internal Server Error', status = 500, details = null) =>
  res.status(status).json({ success: false, message, details });
