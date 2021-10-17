# Dockerfile for IOS Press phuzzy.link branch
FROM node:11
MAINTAINER Blake Regalia <blake.regalia@gmail.com>

# source code
WORKDIR /src/app
COPY . .

# install packages
RUN apt-get -y update \
    && apt-get upgrade -y \
    && apt-get install -yq \
        git \
    && apt-get clean

# install software
RUN npm i

# entrypoint
ENTRYPOINT ["node", "/src/app/src/server/server.js"]
