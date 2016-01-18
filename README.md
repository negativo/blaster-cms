# NoNameYet CMS
tested on node 4.2.1

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS.
Simple and light CMS framework build with plain NodeJS/express.

####Why
That's what I need to bootstrap small projects.

###Ongoing
Some security and optimization behing done on serverside.

##Installation
At first startup it get installed, be sure to check .env file for database and other datas needed for installation

	npm install
	bower install
	npm start

npm start use nodemon on server.js if you have problem with it you should install it globally
	npm install -g nodemon

##changelog
	- Password reset on /admin/reset-password
	- cached configurations & random performance enhance
	- normal user edit profile
	- removed unused modules

## Known Bugs

##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [1] CSRF
	- [2] File browser in tinyMCE ??
	- [3] Reduce controllers ? 
	- [3] Should expose a better api
	- [3] add google analytics from configurations
	- [3] Blank template with only ejs rendering of data to let users bootstrap their theme.