package httpapi

import (
	"bufio"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"net"
	"net/http"
	"strings"
	"sync"
)

// calculateAcceptKey computes the Sec-WebSocket-Accept header value from the client key.
func calculateAcceptKey(key string) string {
	h := sha1.New()
	h.Write([]byte(key))
	h.Write([]byte("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

// Upgrade upgrades the HTTP connection to a raw WebSocket connection.
func Upgrade(w http.ResponseWriter, r *http.Request) (net.Conn, *bufio.ReadWriter, error) {
	upg := strings.ToLower(strings.TrimSpace(r.Header.Get("Upgrade")))
	if upg != "websocket" {
		return nil, nil, fmt.Errorf("not a websocket upgrade request")
	}

	hj, ok := w.(http.Hijacker)
	if !ok {
		return nil, nil, fmt.Errorf("webserver does not support connection hijacking")
	}

	conn, bufrw, err := hj.Hijack()
	if err != nil {
		return nil, nil, err
	}

	key := r.Header.Get("Sec-WebSocket-Key")
	accept := calculateAcceptKey(key)

	bufrw.WriteString("HTTP/1.1 101 Switching Protocols\r\n")
	bufrw.WriteString("Upgrade: websocket\r\n")
	bufrw.WriteString("Connection: Upgrade\r\n")
	bufrw.WriteString("Sec-WebSocket-Accept: " + accept + "\r\n\r\n")
	bufrw.Flush()

	return conn, bufrw, nil
}

// writeTextMessage sends a standard unmasked WebSocket text frame to the connection.
func writeTextMessage(conn net.Conn, msg string) error {
	payload := []byte(msg)
	length := len(payload)
	if length > 125 {
		return fmt.Errorf("websocket payload too large for simple framer (max 125 bytes)")
	}

	// 0x81: FIN=1, Opcode=1 (Text frame)
	header := []byte{0x81, byte(length)}
	if _, err := conn.Write(header); err != nil {
		return err
	}
	if _, err := conn.Write(payload); err != nil {
		return err
	}
	return nil
}

// WebSocketHub tracks connection subscribers per payment session ID and broadcasts updates.
type WebSocketHub struct {
	mu          sync.Mutex
	subscribers map[string]map[net.Conn]bool
}

// WsHub is the global registry of active websocket subscribers.
var WsHub = &WebSocketHub{
	subscribers: make(map[string]map[net.Conn]bool),
}

// Register adds a connection to the subscribers list for a session.
func (h *WebSocketHub) Register(sessionID string, conn net.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if _, ok := h.subscribers[sessionID]; !ok {
		h.subscribers[sessionID] = make(map[net.Conn]bool)
	}
	h.subscribers[sessionID][conn] = true
}

// Unregister removes a connection from the subscribers list.
func (h *WebSocketHub) Unregister(sessionID string, conn net.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if conns, ok := h.subscribers[sessionID]; ok {
		delete(conns, conn)
		if len(conns) == 0 {
			delete(h.subscribers, sessionID)
		}
	}
}

// Broadcast sends the message to all connections subscribed to the session.
func (h *WebSocketHub) Broadcast(sessionID string, msg string) {
	h.mu.Lock()
	conns := []net.Conn{}
	if cMap, ok := h.subscribers[sessionID]; ok {
		for c := range cMap {
			conns = append(conns, c)
		}
	}
	h.mu.Unlock()

	for _, c := range conns {
		_ = writeTextMessage(c, msg)
	}
}
