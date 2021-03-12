const express = require('express'); // bring express module
const router = express.Router();
const fetch = require('node-fetch');
const { pool } = require('../db');
const distanceInWords = require("date-fns/formatDistanceToNow");


//group
router.get('/channel', (req, res) => res.render('channel'));

// clicking on channel page redirects you to a group page with desired name
// router.get('/channel_page', (req, res) => res.render('channel_page'));


const messages = [
  {
    text: "Welcome!",
    user: "Admin",
    added: new Date(),
  },

];


/* GET discussion board. */
router.get("/channel_page/:channel_name", async (req, res) => {

  try{
      while (messages.length > 1) {
        messages.pop();
      }
      const {channel_name} = req.params;
      let result = await fetch("http://localhost:3000/" + channel_name, {method:"GET"})
      const discussion = await result.json();
      discussion.forEach(t=>
      {
        messages.push({
          text: t.message,
          user: t.sender,
          added: new Date(),
        });

      })

    res.render("channel_page", { name: req.params.channel_name, title: "Discussion Board", messages: messages, format: distanceInWords });
  }

  catch (err) {
      console.error(err.message);
  }

});

/* GET new message page. */
router.get("/new/:name", function (req, res, next) {
  res.render("form", {name: req.params.name});
});





module.exports = router;
