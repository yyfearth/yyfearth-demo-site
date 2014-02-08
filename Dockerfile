# Node.js env for demo.yyfearth.com
# VERSION       1.0

FROM ubuntu:12.10
MAINTAINER Wilson Young <yyfearth@gmail.com>

# upgrade packages
# dialog to avoid complain "debconf: unable to initialize frontend: Dialog" while installing
RUN apt-get update && apt-get upgrade -y

# install dependencies
# python-software-properties python for ppa
# build-essential for node-gyp
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update && apt-get install -y nodejs npm

# deploy
RUN mkdir /app
ADD server.js /app/server.js
ADD package.json /app/package.json
ADD cache /app/cache

RUN cd /app; npm install

EXPOSE 8080
CMD ["/usr/bin/nodejs", "/app/server.js"]
