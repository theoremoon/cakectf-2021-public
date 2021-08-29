package main

import (
    "log"
    "github.com/labstack/echo"
)

func run() error {
    e := echo.New()
    e.File("/", "public/flag.txt")
    if err := e.Start(":8000"); err != nil {
        return err
    }
    return nil
}

func main() {
    if err := run(); err != nil {
        log.Fatalf("%+v\n", err)
    }
}
