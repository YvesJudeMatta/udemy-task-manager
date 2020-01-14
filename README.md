# Task Manager app

## Overview

Node Express API to manage users and associated tasks. Simple idea used to demonstrate more complex features when building node applications.

Kept comments in this repo to re-encorce other implementations that could be done.

It hosted on Heroku at this [url][hosted-url].

## Run locally

Clone repo

```
$ git clone git@github.com:YvesJudeMatta/node_complete_task_manager.git
```

Install dependencies

```
$ cd node_complete_task_manager
$ npm install
```

Include `config` folder with the following files `dev.env` and `test.env` with the following variables filled in (replace any {} with your values, keep in mind I built this application to use a seperate database for tests):

```
PORT={}
SENDGRID_API_KEY={}
MONGODB_URL={}
JWT_SECRET={}
```

Start server

```
$ npm run dev
```

Test API

```
$ npm run test
```

You should now be able to preview the app on `localhost:3000`

## Deployment

### Heroku Prerequisites

[Install Heroku Cli][install-heroku]

Create a Heroku account

Login via Heroku cli

```
$ heroku login
```

### Create OR use existing heroku app

Create Heroku app with heroku-cli and replace `{app_name}` with your preference or choose to omit it for a randomly generated name

```
$ heroku create {app_name}
```

Use existing Heroku app with heroku-cli and replace `{app_name}` with your Heroku app name

```
$ heroku git:remote -a {app_name}
```

### Verify Heroku remote

You should see (fetch) and (push) for `heroku` along with your `origin` remote with the following command

```
$ git remote -v
```

### Push to Heroku remote

```
$ git push heroku master
```

## API Routes

### Users

method|url|description|authenticated
---|---|---|---
POST|/users|Create a new user and send welcome email|false
POST|/users/login|Login as existing user, will pass jwt in headers|false
POST|/users/logout|Logout session|true
POST|/users/logout/all|Logout all sessions|true
GET|/users/me|Retreive logged in user profile in session|true
PATCH|/users/me|Update logged in user profile |true
DELETE|/users/me|Delete logged in user profile|true
POST|/users/me/avatar|Upload picture for user profile avatar in session|true
DELETE|/users/me/avatar|Delete picture for user profile avatar in session|true
GET|/users/:id/avatar|Retreive avatar picture from specific user profile by id|true


### Tasks

method|url|description|authenticated
---|---|---|---
POST|/tasks|Create a task for logged in user|true
GET|/tasks|Retreive tasks from logged in user|true
GET|/tasks/:id|Get specific task from logged in user by id|true
PATCH|/tasks/:id|Update specific task from logged in user by id|true
DELETE|/tasks/:id|Delete specific task from logged in user by id|true

## Embed postman scripts

Copy in an HTML page and click `Run in Postman`.

```html
<div class="postman-run-button"
data-postman-action="collection/import"
data-postman-var-1="70c0b288b32335e8895b"></div>
<script type="text/javascript">
  (function (p,o,s,t,m,a,n) {
    !p[s] && (p[s] = function () { (p[t] || (p[t] = [])).push(arguments); });
    !o.getElementById(s+t) && o.getElementsByTagName("head")[0].appendChild((
      (n = o.createElement("script")),
      (n.id = s+t), (n.async = 1), (n.src = m), n
    ));
  }(window, document, "_pm", "PostmanRunObject", "https://run.pstmn.io/button.js"));
</script>
```

## Tech stack

- Node
    - web framework
- Express
    - library for web server
- bcryptjs
    - encryption
- @sendgrid/main
    - sending emails
- jsonwebtoken
    - use for session authentication
- mongodb & mongoose
    - database driver and ORM for database persistence
- multer & sharp
    - image upload & processing
- supertest & jest
    - integration and unit testing
- validator
    - validation
- env-cmd
    - use environment variables from .env files
- nodemon
    - watch files to hot reload server when files are changed
- Heroku
    - Deployment


[udemy-course]: https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
[hosted-url]: https://node-complete-task-manager.herokuapp.com/
[install-heroku]: https://devcenter.heroku.com/articles/heroku-cli