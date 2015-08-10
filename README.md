# Node CMS
(NoNameYet)

###Simple node powered CMS for blog, small website and who know.
OpenSource NodeJS CMS Framework.
This is going to be my personal framework from small works but I'm planning to add functionality to help the final users create new pages/routes and changig styles and custom tempaltes, not in the actual stage of course, the views file are completely messed up and serve only for my testings purposes.

####Why
I'm building this to have a framework to start with when doing small blog and website I'm looking forward to switch from LAMP and wordpress to Node/Mean stacks forever, because I like this kind of stacks a lot more. Yes I know MeanJS but I really like to try and learn doing things from the ground ;)


###Ongoing
The server filestructure seems good but maybe I'll change it later, I'm refactoring things everyday because I find a better way to do something.

Gonna implement a local node&npm /bin packed to it, the idea is to be easy to deploy on
every ubuntu machine, but we will see if this project become somehow usefull.

Basic is done, now I'll work on implementing admin capabilities and adding passport for admin session login, maybe I'll extend it for other user too, user Schema predisposed to have admin:true/false

##changelog
	- Refactored Installation (yep another time)
		-- all db collection created on installation, sample document in Pages and Posts
	- droppped shared obejct from db to config.json
		-- they stay in sync, if file change db get's updated
	- Templating redefined
	- Dinamic route for pages that gets fetch for DB
	- added base structure for admin area
		-- admin area have a /private static folder
		-- admin area have it's own views folder

##ToDos
	- choose if stick to EJS or add Angular, probably I'll avoid using Angular this time.
		-- btw EJS won this time, it's a ton's of ajax call no need for angular.I hope.
	- "Graphic-less" for now because I want to focus on Logic before doing base template graphic 
	- time to do admin panel
	- adding helper methods in function.js for frontend needs
		-- adding common function to use while templating
			-- that mean I have to write DOCS
				-- I don't want to write DOCS
					-- maybe I will do it later