# READ ME
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them
```
git - git clone https://github.com/Abhishek-lodha/SCTask.git
cd /path/to/cloned/repo
npm - npm install
```
### Validations
* Username - can only contain alphnumeric characters
* Password - can accept all ascii characters
* Imageurl - must be a url with correct protocol.
* Patch object - must be in valid json format

### Running test cases
* cd /path/to/cloned/repo
* npm test

### Running project
* cd /path/to/cloned/repo
* npm start
* open [localhost:8080](http://localhost:8080) in browser

### Checking Coverage using Istanbul
* istanbul cover _mocha
