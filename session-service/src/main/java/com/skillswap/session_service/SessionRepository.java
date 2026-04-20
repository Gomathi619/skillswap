package com.skillswap.session_service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
    List<Session> findByMatchId(Long matchId);
}