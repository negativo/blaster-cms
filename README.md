# Node CMS
(NoNameYet)

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS.
Simple and light CMS framework build with NodeJS.

####Why
That's what I need to bootstrap my works.
I'm building this to have a framework to start with when doing small blog and websites, I'm looking forward to switch from LAMP and wordpress to Node/Mean stacks forever, because I LOVE this workflow.

Templating is easy and if you are used on working with node writing custom routes too, but I'm planning on addinga way to add custom post/data from backend so the final user can create his page/s and decide what kind of data he want to get rendered inside of it, he'll still need of course to modify EJS files to display his custom data, but I think this way it will be more user friendly than going around messing in the routes modules.

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

##Contributions
If you like this project and want to help you can make you pull request on Test branch.
Keep in mind that I'm not having a lot of free time right now so I may keep this one on hold for a bit.
I need to refactor some modules because I found a better way to keep them organized so I'll eventually keep request on hold until I'll be done with refactoring.

##changelog
	- fixed first installation problem when /bin folder is missing cause of .gitignore
	- working on some backend style to release a first version since the basic functions are all working

##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [1] Password reset, this mean nodemailer this mean oh crap this will be a lot of hour of work.
	- [3] Front end JS API for easy templating for everyone
	- [2] user restriction Admin>Editor>Guest, we have those 3 type of user but still not rules for them
	- [3] add google analithycs script inserction on Configurations and append it in a file that get inculded in footer of the theme.
	- [3] Blank template with only ejs rendering of data to let users bootstrap their theme.