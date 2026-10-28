FROM golang:1.26-alpine AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/archiv \
    ./cmd

FROM alpine:3.22

RUN apk --no-cache add ca-certificates \
    && addgroup -S archiv \
    && adduser -S -G archiv archiv \
    && mkdir /data \
    && chown archiv:archiv /data

COPY --from=build /out/archiv /usr/local/bin/archiv

ENV PORT=8080 \
    DB_PATH=/data/metadata.sqlite \
    SQL_CACHE_PATH=/data/metadata.sqlite.sql

USER archiv
VOLUME ["/data"]
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5m --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["/usr/local/bin/archiv"]
