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
At first startup it get installed, be sure to check .env file for database and other datas needed for installation

	npm install
	bower install
	npm start

npm start use nodemon on server.js if you have problem with it you should install it globally
	npm install -g nodemon

##changelog
	- 3 Kind of user authorization, seems working, 403 returning when unauthorized
	- media manager
	- configurations parsed in request only if updated if not using the cached one.

## Known Bugs

##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [1] Password reset.
	- [2] CSRF
	- [2] User should be able to enter their profile if guest/moderator and edit basic data &&|| delete account
	- [3] Refactor all in controllers
	- [2] File browser in tinyMCE ??
	- [3] Optimize here and there
	- [3] add google analytics from configurations
	- [3] Blank template with only ejs rendering of data to let users bootstrap their theme.