# NoNameYet CMS
tested on node 4.2.1

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS.
Simple and light CMS framework build with plain NodeJS/express.

####Why
That's what I need to bootstrap small projects.

Are you tired of writing everytime a CMS for you small projects/customers ? Are you really really tired of using wordpress to be faster just to find yourself losing tons of time with Hooks and Taxonomies?

Well I am! 

I want a light and deadly simple CMS in Node.JS that I can use as an entry point for all my projects.

What I want in a CMS like this:
- A basic dashboard that I don't have to code everytime both front and backend
- Posts, Pages, Users, Comments system, theme switcher, navigation and social links
- Deadly simple way to add custom logic on top of the source application [Models/Controllers/Routes/API]
- The possibilities to switch from Templating Engine to a Frontend Framework if I want.
- An exposed API for the above frontend framework.

Everything of those functionalities are up and working in this stage of the application, being splitted between /app and /extends give me 
the possibility to fix/update the main application without breaking custom logics on top of it.

What more? Well, optimizing it and making it better with time is my goal now, there are plenty of Node.JS frameworks growing nowadays, so maybe I should look closely if keep going on with Express.JS or using something else (maybe strongloop), but for now I'll stick to it.

###filesystem
| folder | description |
| --- | --- |
| /admin | views and assets for admin dashboard [NB. /src have source JS, while /js have the uglified ones] |
| /app | main app layer, all logic is inside here |
| /extends | extend main layer with custom logics |
| /public | bower assets for both public routes and administrative frontend |
| /themes | here you can add your themes if needed to have more |
| /uploads | all uploads go here, /avatar is for user avatars (of course, silly) |

/app breakdown

| /app | description |
| --- | --- |
| ./init.js | the main file requiring all necessary modules and starting the server [called by server.js in root folder] |
| /configs | container configuration module and events/routines and global variables |
| /controllers | Controllers for models and/or generic routes management |
| /lib | helper libraries and personal modules |
| /middlewares | application-wide middlewares and his sub modules |
| /models | Models for MongoDB data and their custom methods |
| /routes | routes handler modules, splitted in public, private and api;  |


###Contribs
If you like it and want to contribute, I'll be glad to look at PR and general advices :)

###Ongoing
All the logics I needed are there, I'm going to give a look at everything and refactor old structures remained here and there.
I really should have done a TDD at start, I know, but I'm really used to debug in console/postman, but I'm playing around with mocha and I like it, I'll integrate it in the near future when I have some time.

##Installation
The installation get checked on server startup so give a look at .env and change you credentials

	npm install
	bower install
	npm start

nb: if you find some problem with npm start, install nodemon globally

##changelog
	- Google Analytics rendered on all public view in analytics var
	- extends!
	In Extends folder you can add functionalities without breaking the main app, so update would be easier

## Known Bugs
- You tell me!
- Sometimes I find 'undefined' variables in EJS views, I fixed all of 'em but somethings may be still around popping up with state mutations
- there are old variables and structures around to refactor ( Messages module that was usefull in earlier version but not now, should be refactored out)



##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [1] Generic look for data integrity and well DB relationships, better do this now before I use it in prod.
	- [1] Docs for shared variables across views and well, generic docs for willing devs..or myself..
	- [2] Blank Theme
