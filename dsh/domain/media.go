package domain

import "time"

type ProductMediaRecord struct {
	ID        string    `json:"id"`
	ProductID string    `json:"product_id"`
	MediaKey  string    `json:"media_key"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
}

type UploadProductMediaRequest struct {
	ProductID string `json:"product_id"`
	MediaKey  string `json:"media_key"`
}
