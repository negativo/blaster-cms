# NoNameYet CMS
tested on node 4.2.1

##OpenSource NodeJS CMS Framework.
###Simple node powered CMS.
Simple and light CMS framework build with plain NodeJS/express.

####Why
That's what I need to bootstrap small projects.

Are you tired of writing everytime a CMS for you small projects/customers ? Are you really really tired of using wordpress just to be faster and the finding that you wasting so much time with all that hooks and taxonomies?
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

###Contribs
If you like it and want to contribute, I'll be glad to look at PR and general advices :)

###Ongoing
All the logics I needed are there, I'm going to do some give a look at everything and refactor old structures remained here and there.
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
	You tell me!

##ToDos
	priority > 1 > 2 > 3 (self explanatory)
	- [2] Blank Template