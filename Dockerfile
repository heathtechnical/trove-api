FROM node

MAINTAINER dan@heathtechnical.com

ADD . /code

WORKDIR /code

RUN ls -l /code && pwd \
    cd /code && npm install

CMD ["node", "/code/server.js"]
