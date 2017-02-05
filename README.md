## heroku-oauthd

**heroku-oauthd** is customized preconfigured [oauthd](https://github.com/oauth-io/oauthd) instance for using at [Heroku](https://heroku.com).  
You do not need it if available [oauth-io plans](https://oauth.io/home/pricing) are suitable for you.
It took for me almost a day to get it running and I'm glad to share experience.  

### Differences from original oauthd:
- includes necessary 'postinstall' and 'start' scripts config in package.json: 'postinstall' runs grunt, 'start' starts the app. See details [here](https://devcenter.heroku.com/articles/node-with-grunt)
- plugins are already installed. It's necessary for heroku, because it's impossible to install plugins in [normal way](https://github.com/oauth-io/oauthd/wiki/Plugin-installation-and-usage) due to install.js way of implementation and [ephemeral-filesystem](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem).
_Sidenote: plugins installation also doesn't work on Windows, because of used ';' command separator and command substitutions $() - e.g. in [install.coffee](https://github.com/oauth-io/oauthd/blob/1.0.2/src/scaffolding/plugins/install.coffee#L45). But in Windows 10 plugins installation could be easily done in [Ubuntu Bash](http://wccftech.com/how-to-run-ubuntu-on-windows-10-guide/)._
- plugins includes their node_modules folder, because submodule grunt build doesn't work out-of-box (perhaps this could be easily improved later)
- config.json contains proper port env var for heroku
- grunt-cli dependency added; dev dependencies moved to main
- versions in "engines" block of package.json adjusted to avoid heroku warnings about too broad versions range

### Starting your own oauthd instance at heroku:  
**1. Clone the repo and go to its dir:**
```sh
λ git clone https://github.com/pmstss/heroku-oauthd
Cloning into 'heroku-oauthd'...
remote: Counting objects: 32378, done.
remote: Compressing objects: 100% (5011/5011), done.
remote: Total 32378 (delta 1344), reused 0 (delta 0), pack-reused 26930R
Receiving objects: 100% (32378/32378), 48.60 MiB | 2.42 MiB/s, done.
Resolving deltas: 100% (14461/14461), done.
Checking connectivity... done.
Checking out files: 100% (20897/20897), done.

λ cd heroku-oauthd
```  

**2. Create heroku instance:**  
Note: If you don't have heroku account, start with [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
```sh
λ heroku create heroku-oauthd-sample
Creating heroku-oauthd-sample... done
https://heroku-oauthd-sample.herokuapp.com/ | https://git.heroku.com/heroku-oauthd-sample.git
```
Last parameter ("heroku-oauthd-sample") is optional instance name. If not provided, heroku will autogenerate some name like falling-wind-42 for you. See [heroku docs](https://devcenter.heroku.com/articles/git) for details.
Ensure in success by running "git remote -v":
```sh
λ git remote -v
heroku  https://git.heroku.com/heroku-oauthd-sample.git (fetch)
heroku  https://git.heroku.com/heroku-oauthd-sample.git (push)
origin  https://github.com/pmstss/heroku-oauthd (fetch)
origin  https://github.com/pmstss/heroku-oauthd (push)
```  

**3. Add Redis addon to you heroku instance:**
```sh
λ heroku addons:create heroku-redis:hobby-dev
Creating heroku-redis:hobby-dev on heroku-oauthd-sample... free
Your add-on is being provisioned and will be available shortly
! Data stored in hobby plans on Heroku Redis are not persisted.
redis-rugged-61142 is being created in the background. The app will restart when complete...
Use heroku addons:info redis-rugged-61142 to check creation progress
Use heroku addons:docs heroku-redis to view documentation
```   
'hobby-dev' above is name of free of charge plan. To get another plans info visit [redis addon page](https://elements.heroku.com/addons/heroku-redis).  

**4. Edit config.js: configure host**  
In step 2 'heroku-oauthd-sample' was specified as desired name, so host url is https://heroku-oauthd-sample.herokuapp.com:
```javascript
var config = {
	host_url: "https://heroku-oauthd-sample.herokuapp.com",		// mounted on this url
	...
```  

**5. Get your redis url**   
REDIS_URL is part of heroku config, you can get it by running:
```sh
λ heroku config | grep REDIS
REDIS_URL: redis://h:pb3142866b813d3551950e42b25aea8cf6d5yxz1bb9cf75448172161440051742@ec2-34-197-246-42.compute-1.amazonaws.com:20242
```  

**6. Edit config.js - configure redis parameters**  
For the given REDIS_URL redis parameters in config.js should look like ('h' - database name - is not used):
```javascript
    ...
	redis: {
		port: 20242,
		host: 'ec2-34-197-246-42.compute-1.amazonaws.com',
		password: 'pb3142866b813d3551950e42b25aea8cf6d5yxz1bb9cf75448172161440051742'
		// database: ...0~15...
		// options: {...other options...}
	},
	...
```
**7. Edit config.js - provide secure salt values**  
```javascript
    ...
	staticsalt: 'i m a random string, change me.',
	publicsalt: 'i m another random string, change me.',
	...
```

**8. Commit your changes:**  
```sh
λ git commit -a -m "configuration"
[master 2960461] configuration
 1 file changed, 4 insertions(+), 4 deletions(-)
```  

**9. Deploy to heroku by pushing changes to heroku repo:**  
```sh
λ git push heroku master
Counting objects: 20340, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (12072/12072), done.
Writing objects: 100% (20340/20340), 32.55 MiB | 434.00 KiB/s, done.
Total 20340 (delta 6644), reused 20308 (delta 6629)
remote: Compressing source files... done.
remote: Building source:
<see http://pastebin.com/aXKxjmF8>
```
Beside push related messages you will see grunt build, which is large enough; full log is available at [pastebin](http://pastebin.com/aXKxjmF8).  

**10. Open your own heroku oauthd instance:**  
With the name given in step 2 url will be: https://heroku-oauthd-sample.herokuapp.com/login  
You will see login/password dialog. **Important**: for the first opening it works like registration, i.e. you can enter any email/password that you will use further for login.  

**11. Enjoy your own oauthd heroku instance!**  
For configuring apps and providers have a look at [oauth.io documentation](https://oauth.io/docs).

### Copyright
#### oauthd
Copyright (C) 2017 Webshell SAS
[https://github.com/oauth-io/oauthd](https://github.com/oauth-io/oauthd) and other contributors
#### heroku-oauthd
Copyright (C) 2017 Viachaslau Tyshkavets [pmstss](https://github.com/pmstss/)

### License

[Apache License 2.0](https://spdx.org/licenses/Apache-2.0.html#licenseText)
