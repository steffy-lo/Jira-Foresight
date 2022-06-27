const express = require("express");
const app = express();
const serverless = require('serverless-http');
const axios = require("axios");
const cors = require("cors");
const router = express.Router();

////////////
//MIDDLEWARE
////////////
app.use(express.json())
app.use(cors());

///////////////
//Routes and Routers
//////////////
router.post("/issues", async (req, res) => {
  const { username, hostname, apiToken, issueKeys } = req.body;
  const reqBody = {
    "jql": `key in (${issueKeys.join()})`,
    "fields": [
      "issuetype",
      "summary",
      "description",
      "priority",
      "assignee",
      "status",
      "attachment",
      "comment",
      "watches"
    ]
  }
  const creds = `${username}:${apiToken}`
  axios({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${new Buffer(creds).toString('base64')}`
    },
    data: reqBody,
    url: `${hostname}/rest/api/2/search`,
  }).then(result => {
    res.send(result.data);
  }).catch(err => {
    res.send(err);
  })
});

app.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);
