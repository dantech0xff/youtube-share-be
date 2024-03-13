# Welcome to Youtube Share Service

This is a Backend app that allows registered users to share youtube videos with other users. It is built with Nodejs, Express, MongoDB, JWT and Socket.IO real-time notifications.

For quickly understanding the project, you can visit the following links:

- [Part 01: Introduce to project structure](https://www.youtube.com/watch?v=6UfdAqqyMEs)
- [Part 02: Explain the Socket.IO for Notifications](https://www.youtube.com/watch?v=dRNAPKuApd8)
- [Part 03: Demo via POSTMAN](https://www.youtube.com/watch?v=yqZxFhcX-dk)
- [Part 04: Demo via FE Web](https://www.youtube.com/watch?v=ieXKWpE066s)
- [Part 05: Visit my FE Web](https://youtube-share-fe.vercel.app/)

---

## Prerequisites

You should prepare the following before you start for better experience:

- Nodejs 18: Install via <https://github.com/nvm-sh/nvm>
- Express: Follow the version in `package.json`
- Socket.IO: Follow the version in `package.json`
- JWT: Follow the version in `package.json`
- MongoDB Atlas: Create your account in <https://cloud.mongodb.com/>, you also should download MongoDB Compass to manage your database <https://www.mongodb.com/products/tools/compass>
- Postman: Download the latest version here <https://www.postman.com/downloads/>
- Docker: Install Docker Desktop <https://www.docker.com/products/docker-desktop>

You're good to have the tools below for better experience:

- **[\***Optional**\*]** Git Desktop: Good to have, download the latest version here <https://desktop.github.com/>
- **[\***Optional**\*]** Github Copilot: `Use it if you have it, it's a great tool for coding`

## Installation

### Clone the repository

- `git clone https://github.com/dantech0xff/youtube-share-be.git`

- `npm install`

### Postman

- Open Postman
- Import the collection from folder `post-man-collections` in the root of repository
- Select Dev Environment, set the `host` in the environment to `http://localhost:3002`
- Test the Endpoints

### MongoDB Atlas

- Create your account in <https://cloud.mongodb.com/>
- Create your Project
- Create your Database Cluster (Remember to select Free tier)
- Select your database, click on `Connect` and select your tools (should use MongoDB Compass)
- Copy the connection link, go to `services/database.services.ts` and set value for `dbConnectionUrl` (Remember to follow the format)
- Paste your account, password to the .env file `MONGO_DB_USER_NAME` `MONGO_DB_USER_PASSWORD`
- Open MongoDB Compass and connect to your database
- Create your database, rename it yourself, set to .env file `MONGO_DB_NAME`
- Remember to create your collections: `users`, `videos`, `followers`, `interactions`, `notifications`

### Run the app

- `npm run dev`

- Open your browser and navigate to <http://localhost:3002>

### Run the unit tests

- `npm run test`

## Deployment

### Deploy Docker for Local Development

- Test your Docker installation: `docker --version`
- cd to the root of the repository
- Run `docker build --process=plain -t local-docker/ytb-share-be:tag0 -f Dockerfile.local .`
- Run `docker container run -dp 3002:3000 local-docker/ytb-share-be:tag0`
- Open your browser and navigate to <http://localhost:3002>
- Test the Endpoints in Postman (Remember to set `host` to `http://localhost:3002`)

### Deploy Docker to Google Cloud Platform

- Create your GCP account via <https://console.cloud.google.com/>
- Create your Project, name it yourself
- Remember to have a creadit card to setup Billing Account **Selecting Top Left Menu -> Billing**
- Enable: **Artifact Registry**, **Cloud Build**,**Cloud Deploy**
- Setup gcloud cli: <https://cloud.google.com/sdk/docs/install>
- Run `gcloud auth login` then select your account, and the project you created for this app
- Run `gcloud config set project {your-project-id}`
- Create your Artifact Repo: `gcloud artifacts repositories create ytb-share-be-repo --repository-format=docker --location=us-central1 --description="Youtube Share Service Docker Repo"`
- Run `gcloud builds submit --tag us-central1-docker.pkg.dev/{your-project-id}/ytb-share-be-repo/ytb-share-be-image:tag0` (select the region `us-central1` because I can't select `asia-southeast1`, if you can, select `asia-southeast1`)
- Go to your GCP console, Search **Cloud Run** and select it; Click on **Create Service** ; Select the image you just built; **REMEMBER TO SET YOUR VARIABLE & SECRET USING your .env File in local**; Set the region of you; Click on **Create**
- Get the URL of your service, open your browser and navigate to it
- Test the Endpoints in Postman (Remember to set `host` to your service `URL`)

## Common Issues

- Remember to set **ENVIRONMENT VARIABLES IN YOUR DEPLOYMENT**
- Remember to set **ENVIRONMENT VARIABLES IN GCP CLOUD RUN**
- Remember to set **ENVIRONMENT VARIABLES IN POSTMAN**

### Feels free to contact me via email <danhtran.dev@outlook.com> if you have any questions or issues
