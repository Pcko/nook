# How to use nook

## DEV

### API

#### Run in ./api
Start the development api server:
```bat
npm install
npm run dev
```

\
Run to get detailed error info:
```bat
npm run typecheck
```

### PUBLISHER

#### Run in ./api

Start the development publisher server:
```bat
npm install
npm run publisherdev
```

### APP

#### Run in ./app

Start the development app server:
```bat
npm install
npm run dev
```

\
Run a code-check:
```bat
npm run lint

npm run lint:fix
```

## PROD

### API

#### Run in ./api
Start the production api server:
```bat
npm install
npm run build
npm run prod
```

### PUBLISHER SERVER

#### Run in ./api

Start the production publisher server:
```bat
npm install
npm run publisherprod
```



### APP

#### Run in ./app

Bundle the server files into a build:
```bat
npm install
npm run build
```

Test the build:
```bat
npm run preview
```

Deploy the dist/ folder to a hosting provider

## ENVIRNOMENT VARIABLES
### API
```env
MONGODB_URI= <MongoDB connection-string>
DB_NAME= <Database name>
PORT= <Port the server starts on>
PUBLISH_PORT= <Port the publishing server starts on>
ACCESS_TOKEN_SECRET= <Base64 encoded secret>
REFRESH_TOKEN_SECRET= <Base64 encoded secret>
EMAIL_USER= <Email used for the email client>
EMAIL_PASS= <app access passcode for email>
APP_URL= <BaseURL of the app server>
RAG_URL= <BaseURL of the rag server>
RAG_KEY= <RagKey for access to the rag server>
DEVENV=true (remove if starting in production)
```

### APP
```env
VITE_API_URL= <BaseURL of the API server>
VITE_PUBLISH_URL= <BaseURL of the publishing server>
```
