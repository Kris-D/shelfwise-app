// middleware/encryptResponse.js
const { encryptData } = require("../utils/encrypt");

function encryptResponse(req, res, next) {
  const oldJson = res.json.bind(res);

  res.json = function (data) {
    // avoid double-encrypt if already encrypted
    if (data && data.encrypted) return oldJson(data);

    const encrypted = encryptData(data);
    // Option A: Send only encrypted payload
    return oldJson(encrypted);
    // Option B: include metadata:
    // return oldJson({ encrypted, iv: "<if you used dynamic iv>", salt: "<if dynamic>" });
  };

  next();
}

module.exports = encryptResponse;