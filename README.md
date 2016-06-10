# GraphWhy <img src="https://github.com/GraphWhy/graphwhyfrontend/blob/master/app/images/logo.png" align="right" height="100"/>

GraphWhy is a free solution to the need for a good unrestrained survey provider.

## Getting Started

Following this section will get you up and running so you can see what we are working with on our back end. Hopefully you will decide to help the cause aswell! (Instructions assume Ubuntu 14.04 but should work with other linux distros)

### Prerequisites

Git -> https://git-scm.com/book/en/v2/Getting-Started-Installing-Git</br>
Or: ```sudo apt-get install git-all```</br>

Node ->  https://nodejs.org/en/download/package-manager/</br>
Or: ```curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -``` </br>
          ```sudo apt-get install -y nodejs```</br>

Mongo -> https://docs.mongodb.com/manual/installation/</br>
Or: ```sudo apt-get install mongodb```</br>
          
### Install
```
sudo git clone https://github.com/GraphWhy/GraphwhyBackend.git
cd GraphwhyBackend
sudo npm install
```
### Use
Go to GraphwhyBackend then setup mongo:</br>
```
sudo mkdir data
sudo mongod --dbpath data &
```
In the GraphwhyBackend directory start up the app:
```
sudo npm start
```
Next navigate your browser to ```localhost:3010```. </br>
Finally here is our back end.
