FROM golang:1.16.1 as builder

WORKDIR /app

COPY go.mod /app/go.mod
COPY go.sum /app/go.sum
COPY main.go /app/main.go

RUN go build -o app

FROM debian:buster-slim

WORKDIR /app

COPY --from=builder /app/app /app/app

RUN mkdir /app/public
COPY ./public/flag.txt /app/public/flag.txt

ENTRYPOINT "/app/app"

