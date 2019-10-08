const verify = require('./vertifyToken')

async function routes(fastify, options) {
  fastify.get("/",{verify}, async (req, res) => {
    res.send(req.user)
  });
}

module.exports = routes;
