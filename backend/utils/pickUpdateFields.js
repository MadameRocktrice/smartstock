const pickUpdateFields = (body, allowedKeys) =>
  Object.fromEntries(
    allowedKeys
      .filter((key) => Object.prototype.hasOwnProperty.call(body, key))
      .map((key) => [key, body[key]])
  );

module.exports = pickUpdateFields;
