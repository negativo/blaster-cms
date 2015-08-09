# Node CMS
(NoNameYet)

###Simple node powered CMS for blog, small website and who know.
OpenSource NodeJS CMS Framework.
This is going to be my personal framework from small works but I'm planning to add functionality to help the final users create new pages/routes and changig styles and custom tempaltes, not in the actual stage of course, the views file are completely messed up and serve only for my testings purposes.

####Why
I'm building this to have a framework to start with when doing small blog and website I'm looking forward to switch from LAMP and wordpress to Node/Mean stacks forever, because I like this kind of stacks a lot more. Yes I know MeanJS but I really like to try and learn doing things from the ground ;)


###Ongoing
Installation process from now takes MongoDB credentials and website basic info&user 
and craetes collections and keep them in sync between filesystem and mongo.

The server filestructure seems good but maybe I'll change it later, I'm refactoring things everyday because I find a better way to do something.

Gonna implement a local node&npm /bin packed to it, the idea is to be easy to deploy on
every ubuntu machine, but we will see if this project become somehow usefull.

Next I'll work on posts system, starting from a very basic blog to add more functionality later.

I'm testing a lot with curl request from now so views are completely missing, because I'm thinking ahead for views file strucutre to allow future custom template installation and switching, I'll add frontend sometimes in the future.

##changelog
	- installation fully working
	- added basic template structure in views
		-- home is the only one that get rendered apart, for now.

##ToDos
	- choose if stick to EJS or add Angular, probably I'll avoid using Angular this time.
	- create pages collection when installing with a sample page inside
		-- create page-template
	- create post-template
	- start creating user's admin panel
	- ??? 
