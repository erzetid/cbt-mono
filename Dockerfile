# Copyright (c) 2022 StasiunFile Inc
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT

FROM node:lts as base

# RUN apk update && apk add --no-cache pkgconfig openssl-dev ca-certificates linux-headers && update-ca-certificates
RUN mkdir /app
WORKDIR /app
# Add package file
COPY package.json /app
# Copy source
COPY dist /app/dist

RUN npm install npm@latest

# Install deps
RUN npm install --production
# Start production image build
FROM node:lts-alpine as prod

WORKDIR /app
ENV ACCESS_TOKEN_KEY=${ACCESS_TOKEN_KEY}
ENV REFRESH_TOKEN_KEY=${REFRESH_TOKEN_KEY}
ENV MONGO_URI=${MONGO_URI}
ENV PORT_APP=${PORT_APP}
# Copy node modules and build directory
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/dist /app/dist
COPY --from=base /app/package.json /app
# Expose port 5000
EXPOSE 5000

CMD npm run start