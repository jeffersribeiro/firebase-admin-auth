FROM node:16

ENV NODE_ENV production

ARG PORT
ENV PORT=${PORT}

WORKDIR /usr/src/app

COPY . .

RUN yarn

EXPOSE ${PORT}

CMD ["yarn", "start"]