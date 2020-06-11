# BIA-SPA

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/mnazarov01/BIA-SPA.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/mnazarov01/BIA-SPA/context:javascript) [![Build Status](https://travis-ci.org/mnazarov01/BIA-SPA.svg?branch=master)](https://travis-ci.org/mnazarov01/BIA-SPA)

## Introduction 

This is a complete single page application with client routing and server API module.

Powered by [Express](https://github.com/expressjs/express)

DBMS [Mongodb](https://www.mongodb.com/) 

Modeling tool [mongoose](https://github.com/Automattic/mongoose)

Linter [eslint](https://github.com/eslint/eslint)

Module bundel [webpack](https://github.com/webpack/webpack)

## Quick Start 

Run the command 

```
$ npm install
```

### After install in your app directory, and edit the default config file.

```
$ mkdir config
$ echo > config/default.json
```

And add the following text (you need `change` (`dbConnection`) to your URL and (`applicationPort`) to your port)

```
{
    "applicationPort": { 
        "dev-server": 8080,
        "dev-api": 5000,
        "prod": 5000
    },
    "dbConnection": {
        "dev": "mongodb+srv://name_user:password@cluster-mjrxz.mongodb.net/dev",
        "prod": "mongodb+srv://name_user:password@cluster-mjrxz.mongodb.net/prod"
    }
}

```

### Build

```
$ npm run build
```

### Launch

```
$ npm run start
```

# Development mode

```
$ npm run dev
```

### Test

```
$ npm jest
```


