# NoNameYet CMS
tested on node 4.2.1

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS.
Simple and light CMS framework build with plain NodeJS/express.

####Why
That's what I need to bootstrap small projects.

###Ongoing
All basic function are working, it's time to give backend some UX/UI and start adding utility to backend, I'm thinking of a plugin system to add functionality with node modules, I'll start it when I'm done with everything else

##Installation
	npm install
	bower install
	cd private
	bower install
	npm start

npm start use nodemon on server.js if you have problem with it you should install it globally
	npm install -g nodemon

##changelog
	- refactored a lot of file
	- shared data in app.locals, no more in request object
	- middleware split and redone
	- updated some packages

##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [1] Password reset.
	- [2] Uploaded image browser.
	- [2] user restriction Admin>Editor>Guest, we have those 3 type of user but still not rules for them
	- [3] add google analithycs script inserction on Configurations and append it in a file that get inculded in footer of the theme.
	- [3] Blank template with only ejs rendering of data to let users bootstrap their theme.