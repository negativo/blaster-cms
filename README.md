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


##changelog
	- you can add some basic css from the dashboard in appearance > Custom CSS
	- added tags to post
	- refactored private/public routes controller, you now have 2 Constructor to build the render object with variables
		each one have default values and you can add new one new Render(req, { newVar: value } )
		you now have newVar eand all the default variables avaible in your ejs rendered file file
		/lib/render-helper is the module

##ToDos
	- user registration
		- user restriction Admin>Editor>Guest
	- comments on posts
		Should be registered.
		I don't know if creating it's own comments system or using Disqus
	- add google analithycs script inserction on Configurations and append it in a file that get inculded in footer of the theme.
	- create a starter blank template with all the things in place to start developing easily a theme.