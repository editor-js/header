module.exports = new Proxy({}, {
  get: (_target, prop) => prop,
});
