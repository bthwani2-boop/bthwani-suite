package store

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

// MediaStorageConfig holds MinIO/S3-compatible config read from env.
type MediaStorageConfig struct {
	Provider      string // "minio" or "s3"
	Endpoint      string // internal Docker endpoint, e.g. http://minio:9000
	PresignHost   string // public host for presigned URLs, e.g. http://127.0.0.1:9000
	PublicBaseURL string // e.g. http://127.0.0.1:9000/bthwani-media-local
	Bucket        string
	AccessKey     string
	SecretKey     string
	Region        string
	PresignTTL    int // seconds
}

func MediaStorageConfigFromEnv() MediaStorageConfig {
	ttl := 900
	if v := os.Getenv("DSH_MEDIA_PRESIGN_TTL_SECONDS"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			ttl = n
		}
	}
	region := os.Getenv("DSH_MEDIA_REGION")
	if region == "" {
		region = "us-east-1"
	}
	// DSH_MEDIA_PRESIGN_HOST: public host used in presigned URL returned to clients.
	// Set to http://127.0.0.1:9000 for local dev so browsers/mobile can PUT directly.
	// Falls back to DSH_MEDIA_S3_ENDPOINT if not set (correct for Docker-internal clients).
	presignHost := os.Getenv("DSH_MEDIA_PRESIGN_HOST")
	if presignHost == "" {
		presignHost = os.Getenv("DSH_MEDIA_S3_ENDPOINT")
	}
	return MediaStorageConfig{
		Provider:      os.Getenv("DSH_MEDIA_STORAGE_PROVIDER"),
		Endpoint:      os.Getenv("DSH_MEDIA_S3_ENDPOINT"),
		PresignHost:   presignHost,
		PublicBaseURL: os.Getenv("DSH_MEDIA_PUBLIC_BASE_URL"),
		Bucket:        os.Getenv("DSH_MEDIA_BUCKET"),
		AccessKey:     os.Getenv("DSH_MEDIA_ACCESS_KEY"),
		SecretKey:     os.Getenv("DSH_MEDIA_SECRET_KEY"),
		Region:        region,
		PresignTTL:    ttl,
	}
}

// IsConfigured returns true when MinIO env vars are present.
// When false, the API records metadata but cannot generate real upload URLs.
func (c MediaStorageConfig) IsConfigured() bool {
	return c.Endpoint != "" && c.Bucket != "" && c.AccessKey != "" && c.SecretKey != ""
}

// CanonicalStorageKey builds the bucket-relative object key for a given owner+purpose+id.
// Enforces the path contract from PHASE 3.
func CanonicalStorageKey(ownerType, ownerID, purpose, mediaID, ext string) string {
	if ext != "" && !strings.HasPrefix(ext, ".") {
		ext = "." + ext
	}
	switch ownerType {
	case "product":
		return fmt.Sprintf("dsh/products/%s/%s/%s%s", ownerID, purpose, mediaID, ext)
	case "store":
		return fmt.Sprintf("dsh/stores/%s/%s/%s%s", ownerID, purpose, mediaID, ext)
	case "banner":
		return fmt.Sprintf("dsh/banners/%s/%s%s", ownerID, mediaID, ext)
	case "campaign":
		return fmt.Sprintf("dsh/campaigns/%s/%s%s", ownerID, mediaID, ext)
	case "order":
		return fmt.Sprintf("dsh/orders/%s/%s/%s%s", ownerID, purpose, mediaID, ext)
	case "field_visit":
		return fmt.Sprintf("dsh/field-visits/%s/%s/%s%s", ownerID, purpose, mediaID, ext)
	case "support_ticket":
		return fmt.Sprintf("dsh/support-tickets/%s/attachments/%s%s", ownerID, mediaID, ext)
	case "dispute":
		return fmt.Sprintf("dsh/disputes/%s/evidence/%s%s", ownerID, mediaID, ext)
	default:
		return fmt.Sprintf("dsh/misc/%s/%s/%s%s", ownerType, ownerID, mediaID, ext)
	}
}

// PublicURLForKey builds the public object URL from the configured base URL.
func (c MediaStorageConfig) PublicURLForKey(storageKey string) string {
	base := strings.TrimRight(c.PublicBaseURL, "/")
	return base + "/" + strings.TrimLeft(storageKey, "/")
}

// PresignPutURL generates an S3-compatible presigned PUT URL using AWS Signature V4.
// Uses only stdlib — no external MinIO/AWS SDK dependency.
//
// Signing host is taken from PresignHost (the public-facing address clients will PUT to).
// This ensures the Host header in the client's PUT request matches what was signed.
// For local dev: PresignHost = http://127.0.0.1:9000, Endpoint = http://minio:9000 (internal only).
func (c MediaStorageConfig) PresignPutURL(storageKey, mimeType string, now time.Time) (string, error) {
	if !c.IsConfigured() {
		return "", fmt.Errorf("media storage not configured")
	}

	// presignBase is the scheme+host used in both the canonical request and the returned URL.
	// Using the same base for signing and URL generation ensures the Host header matches.
	presignBase := strings.TrimRight(c.PresignHost, "/")
	if presignBase == "" {
		presignBase = strings.TrimRight(c.Endpoint, "/")
	}

	dateStamp := now.UTC().Format("20060102")
	amzDate := now.UTC().Format("20060102T150405Z")
	expiresStr := strconv.Itoa(c.PresignTTL)

	credScope := fmt.Sprintf("%s/%s/s3/aws4_request", dateStamp, c.Region)
	credential := fmt.Sprintf("%s/%s", c.AccessKey, credScope)

	// Build canonical query string (alphabetical order, required by SigV4)
	q := url.Values{}
	q.Set("X-Amz-Algorithm", "AWS4-HMAC-SHA256")
	q.Set("X-Amz-Credential", credential)
	q.Set("X-Amz-Date", amzDate)
	q.Set("X-Amz-Expires", expiresStr)
	q.Set("X-Amz-SignedHeaders", "host")

	objectPath := "/" + c.Bucket + "/" + strings.TrimLeft(storageKey, "/")

	presignURL, err := url.Parse(presignBase)
	if err != nil {
		return "", fmt.Errorf("invalid media presign host: %w", err)
	}
	// Host header value the client will send (must match what we sign).
	host := presignURL.Host

	canonicalQueryString := q.Encode()
	canonicalHeaders := "host:" + host + "\n"
	signedHeaders := "host"

	canonicalRequest := strings.Join([]string{
		"PUT",
		objectPath,
		canonicalQueryString,
		canonicalHeaders,
		signedHeaders,
		"UNSIGNED-PAYLOAD",
	}, "\n")

	stringToSign := strings.Join([]string{
		"AWS4-HMAC-SHA256",
		amzDate,
		credScope,
		hex.EncodeToString(sha256sum([]byte(canonicalRequest))),
	}, "\n")

	signingKey := deriveSigningKey(c.SecretKey, dateStamp, c.Region, "s3")
	signature := hex.EncodeToString(hmacSHA256(signingKey, []byte(stringToSign)))

	q.Set("X-Amz-Signature", signature)

	presigned := presignBase + objectPath + "?" + q.Encode()
	return presigned, nil
}

func sha256sum(data []byte) []byte {
	h := sha256.Sum256(data)
	return h[:]
}

func hmacSHA256(key, data []byte) []byte {
	h := hmac.New(sha256.New, key)
	h.Write(data)
	return h.Sum(nil)
}

func deriveSigningKey(secretKey, dateStamp, region, service string) []byte {
	kDate := hmacSHA256([]byte("AWS4"+secretKey), []byte(dateStamp))
	kRegion := hmacSHA256(kDate, []byte(region))
	kService := hmacSHA256(kRegion, []byte(service))
	kSigning := hmacSHA256(kService, []byte("aws4_request"))
	return kSigning
}
