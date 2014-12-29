Assassins
=========

Kill your friends!

How to start working on it:

1. Install node.js (you did that already)

2. Install Yeoman
  - npm install -g yo bower grunt-cli (http://yeoman.io/learning/index.html)
  
3. In the root directory, you should be able to run:
  - ```grunt serve``` - Opens a locally running server/client to work on.
  This is your __breadwinner__ - it auto-reloads the page whenever you change a file
  and lets you just work your heart out
  - ```yo angular-fullstack:route``` - Generate a route for the angular app.
  I like to generate all routes in client/app/route/ (the default is client/app/), but it's up
  to you.
  
  You shouldn't need a whole lot more but here you go:
  -------------------------------
  - ```grunt``` - Prepared a distribution version of the app to deploy on __Heroku__.
  Not super important, I can take care of deploying, but if you want to then go ahead.
  - ```grunt && grunt buildcontrol:heroku``` - Build and Deploy live.
  - ```cd dist && heroku open``` - Open the current live version of the app
  (https://kill-your-friends.herokuapp.com/)
  -------------------------------
  - ```yo angular-fullstack:endpoint``` - For a server endpoint
  - More at https://github.com/DaftMonk/generator-angular-fullstack#generators
  
