package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang-module/carbon/v2"
)

type Message struct {
	Time string
}

func Handler(w http.ResponseWriter, r *http.Request) {
	now := carbon.Now().ToString()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	m := Message{now}
	b, err := json.Marshal(m)

	if err != nil {
		http.Error(w, fmt.Sprintf("error getting now, %v", err), http.StatusInternalServerError)
	}

	fmt.Fprintf(w, "%s", b)
}