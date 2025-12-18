package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// HealthHandler returns a simple status message
func HealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "up",
		"message": "Surtopya API is running",
	})
}
