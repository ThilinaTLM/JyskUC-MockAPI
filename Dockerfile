FROM oven/bun:1 as build
WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=production

RUN bun install
RUN bun run build

FROM oven/bun:1 AS release

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.output .output
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/bun.lockb .

ENV MONGO_URL="mongodb://mongo:27017/"
ENV NODE_ENV=productiondocke
ENV PORT=4000
ENV HOST=0.0.0.0

VOLUME [ "/usr/src/app/.output/data" ]

EXPOSE 4000

ENTRYPOINT [ "bun", ".output/server/index.mjs" ]
