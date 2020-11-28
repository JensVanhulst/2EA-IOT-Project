<!-- @format -->

# PXL IOT Project

Welcome to the repo for my PXL iot project

[Website](http://www.jensvanhulst.tech)

[Documentation](https://jensvanhulst.github.io/PXL-IOT/docs/)

## Table of contents

- Technologies used
- Tasks and grading strategy
- The project
  - Setup enviroment
  - Server setup

### 01 - Technologies used

- Vue.js ( frontend )
- Express.js ( Backend server API )
- MySQL ( Database )
- C++ ( Arduino program )
- PHP ( Generating the newsfeed )
- XML ( Writing template )
- jsDoc ( Documenting API and front-end )

### 02 - Tasks and grading strategy

#### Main tasks

[x] - At least 1 stand alone embedded device with minimal 2 sensors that collect at 2 different time intervals. <br>

[x] - Collect data via http request <br> [x] - 1 week of usefull data and stored in a future-proof msql table with timestamp <br> [x] - Store the latest value for each sensor in a seperate table <br> [x] - Manually add Data to the database. <br> [x] - Display all data in a single web graph <br> [x] - Display the collected data on a dynamic table (filter) <br> [x] - Generate an RSS feed with php with the latest sensor stats <br> [x] - Use json someware

#### Extra's - Exploring new technologies

[x] - Framework using a Node.js and/or Frontend like react, vue, electron. <br>[x] - Implementing modern web techniques (I did authentication )

# The project

## Get project

```zsh
git clone "https://github.com/JensVanhulst/PXL-IOT.git"

cd "directory"
```

### Run on fronted

```zsh
cd /client

npm install

npm run serve
```

### Run backend

```zsh
cd /api

npm install -g nodemon

npm run start
```

### Upload Arduino code

Code is located in /hardware

# Server setup

I use a [digitalocean](https://www.digitalocean.com/) droplet for 5\$ a month

## Configure

First update the server

```zsh
# Get updates
apt-get update
# Install updates
apt-get upgrade
# Reboot system
sudo reboot now
```

## Generate ssh key

Generate an ssh key with putty <br> On mac run : `ssh-keygen -t rsa`

## Add a user

```zsh
# Create a new user
adduser exampleUser
# Give user permition to sudo group
usermod -aG sudo exampleUser
# Make a directory & paste your previously created ssh key
mkdir ~/.shh
# change permittion
chmod 700 ~/.ssh
# Paste your ssh key here
nano ~/.ssh/authorized_keys
# Change permittion
chmod 600 ~/.ssh/authorized_keys
# Restart Service
sudo service ssh restart
```

## Instal apache2 web server

```
sudo apt install apache2
```

Allow apache in firewall <br>

```
sudo ufw allow in "Apache Full"
```

Go to : http://your_server_ip and you should see the welcome's page of ubuntu.

## Install MySql

```
sudo apt install mysql-server
```

Run configuration

```
sudo mysql_secure_installation
```

### Change password of database user

```
sudo mysql
```

Run the following command to check authentication

```sql
SELECT user,authentication_string,plugin,host FROM mysql.user;
```

Change the password

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

Flush the previleges

```sql
FLUSH PRIVILEGES;
```

Exit sql

```sql
exit;
```

## Install PHP & MySQL

```zsh
sudo apt install php libapache2-mod-php php-mysql
```

- Optional to change what the server first detects ( html or php ):

```zsh
sudo nano /etc/apache2/mods-enabled/dir.conf
```

First item will be taken first

```zsh
<IfModule mod_dir.c>
    DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm
</IfModule>
```

Restart php service

```zsh
sudo systemctl restart apache2
```

Fix php write error

```zsh
sudo chown -R www-data var/www/html
```

## Install PHPMyAdmin

```zsh
sudo apt install phpmyadmin php-mbstring php-gettext

sudo phpenmod mbstring

sudo systemctl restart apache2
```

### Secure PHPMyAdmin

```zsh
sudo nano /etc/apache2/conf-available/phpmyadmin.conf
```

Add an AllowOverride All directive within the <Directory /usr/share/phpmyadmin> section of the configuration file, like this:

```zsh
<Directory /usr/share/phpmyadmin>
    Options FollowSymLinks
    DirectoryIndex index.php
    AllowOverride All
    . . .
```

To implement the changes you made, restart Apache:

```zsh
sudo systemctl restart apache2
```

Create a .htaccess

```zsh
sudo nano /usr/share/phpmyadmin/.htaccess
```

Within this file, enter the following information:

```zsh
AuthType Basic
AuthName "Restricted Files"
AuthUserFile /etc/phpmyadmin/.htpasswd
Require valid-user
```

You can now create this file and pass it an initial user with the htpasswd utility:

```zsh
sudo htpasswd -c /etc/phpmyadmin/.htpasswd username

# add aditional users
sudo htpasswd /etc/phpmyadmin/.htpasswd additionaluser
```

To view PHPMyAdmin go to [https://domain_name_or_IP/phpmyadmin]()

### fix phpmyadmin - count(): Parameter must be an array or an object that implements Countable

[Error on stack overflow ](https://stackoverflow.com/questions/48001569/phpmyadmin-count-parameter-must-be-an-array-or-an-object-that-implements-co)

```
sudo sed -i "s/|\s\*\((count(\$analyzed_sql_results\['select_expr'\]\)/| (\1)/g" /usr/share/phpmyadmin/libraries/sql.lib.php
```

## Install node

Run the following commands

```zsh
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

sudo apt-get install -y nodejs
```

## Configure firewall

To run the express application you need to allow the port for incomming connections

```
sudo ufw allow 3OOO/tcp
```
