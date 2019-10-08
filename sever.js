const fastify = require('fastify')({
  logger: true
})
const dotenv = require('dotenv')
const mongoose = require('mongoose')
//Import Routes
fastify.register(require('./routes/auth'), {prefix:'/api/users'})
fastify.register(require('./routes/posts'),{prefix:'/api/posts'})
// fastify.register(require('fastify-xml-body-parser'))
dotenv.config();

//Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true },
  () => {
    return console.log('connect to db!');
  }
)



fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})

