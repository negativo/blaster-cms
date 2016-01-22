# NoNameYet CMS
tested on node 4.2.1

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS.
Simple and light CMS framework build with plain NodeJS/express.

####Why
That's what I need to bootstrap small projects.

###Ongoing
Security/Performance/some feature I may need

##Installation
At first startup it get installed, be sure to check .env file for database and other datas needed for installation

	npm install
	bower install
	npm start

npm start use nodemon on server.js if you have problem with it you should install it globally
	npm install -g nodemon

##changelog
	- added tinyvision filebrowser on editor
	- cached configurations & random performance enhance

## Known Bugs
	You tell me!

##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [1] CSRF
	- [2] IPs bans
	- [3] Refactor backend.js in modules and use scripts.push in ejs to add view own script
	- [3] add google analytics from configurations
	- [3] Blank template && docs or I won't remember what data I pass across which public paths