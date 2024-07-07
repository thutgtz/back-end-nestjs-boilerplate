FROM node:22.3-alpine3.19 as builder
ENV NODE_ENV build
USER node
WORKDIR /home/node
COPY package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build \
    && npm prune --production

FROM node:22.3-alpine3.19

ARG UUID
ARG ENV_FILE
ENV NODE_ENV production
ENV TZ=Asia/Bangkok

USER node
WORKDIR /home/node
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

COPY deployment/environment/${ENV_FILE}.env ./.env

CMD ["npm", "run","start:prod"]