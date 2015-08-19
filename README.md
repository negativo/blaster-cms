# Node CMS
(NoNameYet)

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS for blog, small website and who knows.
Simple and light CMS framework build with NodeJS.

####Why
I'm building this to have a framework to start with when doing small blog and websites, I'm looking forward to switch from LAMP and wordpress to Node/Mean stacks forever, because I like this kind of stacks a lot more.

Templating is going to be easy, if you work on node adding custom logics too.
That's what I need to bootstrap my works.

###Ongoing
All the basic functions are working right now, need some stiling and a lot of page print data in JSON because I was too lazy.
I need to set all the json data in their place.

##Installation

	npm install
	bower install
	npm start

npm start use nodemon on server.js if you have problem with it you should install it globally
	npm install -g nodemon

##Contributions
	CLOSED (just for a couple of week)
I'm refacotring a lot of thing now so it's difficult to contribute, I'll update this when I found a stable configuration.
Anyway every pull-request should be done on Test Branch.


##changelog
	- Added comment system
		- added backend moderation for comments
		- 1 LVL deep comment, reddit like nesting is possible but I wont do it, but Comment have a recursive field to reference itself.

##ToDos
	- Front end API (wordpress like), for easy templating, I have some ideas but I'll do this after everything else
	- user registration
		- user restriction Admin>Editor>Guest
	- add google analithycs script inserction on Configurations and append it in a file that get inculded in footer of the theme.
	- create a starter blank template with all the things in place to start developing easily a theme.