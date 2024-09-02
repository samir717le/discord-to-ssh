# discord-to-ssh
A discord bot that run any cmd on ssh with fully customizeble

# how to install
how to install and setup discord to ssh
## install required packages
example using apt
```
apt update && apt install git nodejs npm -y
```
## cloning repo
clone the git repo
run
```
git clone https://github.com/samir717le/discord-to-ssh.git
```
## creating bot( very important)
first go to [Discord Developer Portal](discord.dev) <br>
click on application <br>
click on new<br>
and name it anything you went and tick the checkbox
after creating application <br>
go to bot tab than allow all Privileged Gateway Intents <br>
than go to OAuth2 tab
and copy client id
than 
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID_HERE&permissions=2048&integration_type=0&scope=bot
```
replace your client id here with the client id you copied
and paste it on any browser
select server and authorize it 

## install dependencys
cd into directory
``` cd discord-to-ssh ```
install deps ``` npm i ```
## configuration
go to [Discord Developer Portal](discord.dev) <br>
click on application you created than copy token

open .env file and configure
## Starting
``` npm start ```
