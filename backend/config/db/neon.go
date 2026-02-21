package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectNeon() *gorm.DB {
	_ = godotenv.Load()

	connectStr := os.Getenv("DATABASE_URL")
	if connectStr == "" {
		panic("DATABASE_URL environment variable is not set")
	}

	db, err := gorm.Open(postgres.Open(connectStr), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	log.Println("Connected to Neon Postgres successfully!")

	return db
}
