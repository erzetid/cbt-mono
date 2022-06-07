# Copyright (c) 2022 StasiunFile Inc
#
# This software is released under the MIT License.
# https://opensource.org/licenses/MIT

FROM node:latest as base

# RUN apk update && apk add --no-cache pkgconfig openssl-dev ca-certificates linux-headers && update-ca-certificates
RUN mkdir /app
WORKDIR /app
# Add package file
COPY package.json /app
# Copy source
COPY dist /app/dist

# Install deps
RUN npm install --production

COPY .env /app
# Start production image build
FROM node:lts-alpine as prod

WORKDIR /app
# Copy node modules and build directory
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/dist /app/dist
COPY --from=base /app/package.json /app
COPY .env /app
# Expose port 5000
EXPOSE 3000

CMD npm run start