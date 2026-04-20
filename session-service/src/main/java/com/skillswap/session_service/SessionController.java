package com.skillswap.session_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    // Create a new session
    @PostMapping("/create")
    public ResponseEntity<?> createSession(@RequestBody Session session) {
        Session saved = sessionRepository.save(session);
        return ResponseEntity.ok(Map.of(
                "message", "Session scheduled successfully! 🎉",
                "session", saved
        ));
    }

    // Get all sessions for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSessions(@PathVariable Long userId) {
        List<Session> sessions = sessionRepository
                .findByUser1IdOrUser2Id(userId, userId);
        return ResponseEntity.ok(Map.of("sessions", sessions));
    }

    // Get sessions by match id
    @GetMapping("/match/{matchId}")
    public ResponseEntity<?> getMatchSessions(@PathVariable Long matchId) {
        List<Session> sessions = sessionRepository.findByMatchId(matchId);
        return ResponseEntity.ok(Map.of("sessions", sessions));
    }

    // Update session status
    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return sessionRepository.findById(id).map(session -> {
            session.setStatus(body.get("status"));
            sessionRepository.save(session);
            return ResponseEntity.ok(Map.of(
                    "message", "Session status updated! 🎉"
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Rate a session
    @PutMapping("/rate/{id}")
    public ResponseEntity<?> rateSession(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return sessionRepository.findById(id).map(session -> {
            session.setRating((Integer) body.get("rating"));
            session.setReview((String) body.get("review"));
            sessionRepository.save(session);
            return ResponseEntity.ok(Map.of(
                    "message", "Session rated successfully! ⭐"
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}