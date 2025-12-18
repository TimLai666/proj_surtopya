package routes

import (
	"github.com/TimLai666/surtopya-api/internal/handlers"
	"github.com/gin-gonic/gin"
)

// SetupRouter configures the API routes
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS or other middleware would go here

	api := r.Group("/api/v1")
	{
		api.GET("/health", handlers.HealthHandler)
		// Add more routes here, e.g. api.GET("/datasets", handlers.GetDatasets)
	}

	return r
}
