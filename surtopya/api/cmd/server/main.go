package main

import (
	"log"

	"github.com/TimLai666/surtopya-api/internal/routes"
)

func main() {
	router := routes.SetupRouter()

	log.Println("Starting Surtopya API server on :8080...")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
