const express = require('express'); // bring express module
const router = express.Router();
const {v4: uuidv4 } = require('uuid'); // import a certain version of uuid (v4), set and import uuid

//Login
router.get('/login', checkAuthenticated, (req,res) => res.render('login')); // renders login page

//Register
router.get('/register', checkAuthenticated, (req,res) => res.render('register')); // renders register page

router.get('/dashboard', checkNotAuthenticated, (req,res) => res.render('dashboard',{user: req.user.name })); // renders dashboard/account
// if we need to bypass to dashboard, comment out checkNotAuthenticated

//messagebox, redirects you to message system **************************************************
router.get('/message', (req, res) => res.render('index', {user: req.user.name}));
router.get('/message/chat',(req,res) => res.render('chat', {user: req.user.name})); //redirects to chat

//group
router.get('/channel', (req, res) => res.render('channel'));

// clicking on channel page redirects you to a group page with desired name
router.get('/channel_page', (req, res) => res.render('channel_page'));


router.get('/logout',(req,res)=>{ // renders login page after logging out
	req.logout();
	req.flash('success_msg', "You have logged out");
	res.redirect('/users/login');

});

function checkAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return res.redirect('/users/dashboard');
	}
	next();
}

function checkNotAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/users/login');
}


/*******************************************************Groups and Channels*****************************************/
const fetch = require('node-fetch');
const { pool } = require('../dbConfig');
const distanceInWords = require("date-fns/formatDistanceToNow");



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
      let result = await fetch("http://localhost:8000/users/" + channel_name, {method:"GET"})
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


/*******************************************************************************************************************/



module.exports = router;
