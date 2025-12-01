package com.evoting.evoting.repository;

import com.evoting.evoting.model.Election;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElectionRepository extends JpaRepository<Election, Long> {
}
