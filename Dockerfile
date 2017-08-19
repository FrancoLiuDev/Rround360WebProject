FROM node:7.4.0
ADD ssh  /root/.ssh
ENV SERVER=http://60.251.125.208:10006
RUN apt-get update && apt-get install -y git \
	&& touch /root/.ssh/known_hosts \
	&& ssh-keyscan 60.251.125.207 >> /root/.ssh/known_hosts \
	&& chmod 600 /root/.ssh/* \
	&& git clone git@60.251.125.207:H360/oviewpro-web.git \
	&& curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
	&& echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
	&& apt-get update && apt-get install -y yarn \
	&& cd oviewpro-web \
	&& export NODE_ENV= \
	&& yarn \
	&& export NODE_ENV=production \
	&& yarn build \
	&& mkdir tmp \
	&& rm -rf .git \
	&& rm -rf src \
	&& rm /root/.ssh/id_rsa
WORKDIR /oviewpro-web
EXPOSE 80
CMD ["yarn","start"]