const express = require("express");
const redis = require("redis");

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || ("redis://127.0.0.1");

const client = redis.createClient({url: REDIS_URL});
const app = express();
app.use(express.json());
(async() => {
  try {
    await client.connect();
  } catch (e){
    throw Error("Reddis connection error");
  }
  app.get("/counter/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const count = await client.get(id, function(err, reply) {
        res.json({ status: true, count: reply });
      });
      res.json({ status: true, count: count ?? 0 });
    } catch (e) {
      res.json({ status: false });
    }
  })
  app.post("/counter/:id/incr", async (req, res) => {
    const { id } = req.params;
    try {
      await client.incr(id);
      res.json({ status: true });
    } catch (e) {
      res.json({ status: false });
    }
  })
  
  app.listen(PORT);
  console.log('server started at port', PORT);

})();