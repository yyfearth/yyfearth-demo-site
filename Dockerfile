# Node.js env for demo.yyfearth.com
# VERSION       1.0

FROM ubuntu:precise
MAINTAINER Wilson Young <yyfearth@gmail.com>

# upgrade packages and install node.js
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe\ndeb http://ppa.launchpad.net/chris-lea/node.js/ubuntu precise main" > /etc/apt/sources.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C7917B12 && \
	apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y nodejs && \
	apt-get clean

# deploy
RUN mkdir /app
ADD server.js /app/server.js
ADD package.json /app/package.json
ADD cache /app/cache

EXPOSE 8080
CMD ["/usr/bin/nodejs", "/app/server.js"]
