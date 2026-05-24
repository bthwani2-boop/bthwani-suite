package store

import (
	"context"

	"bthwani.local/dsh/domain"
)

type Repository interface {
	ListStores(ctx context.Context, query domain.StoreDiscoveryQuery) (domain.DiscoveryStoresResponse, error)
}
