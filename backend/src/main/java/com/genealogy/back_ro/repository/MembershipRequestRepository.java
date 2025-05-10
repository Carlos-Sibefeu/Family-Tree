package com.genealogy.back_ro.repository;

import com.genealogy.back_ro.model.MembershipRequest;
import com.genealogy.back_ro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, Long> {
    List<MembershipRequest> findByStatus(MembershipRequest.MembershipStatus status);
    List<MembershipRequest> findByUser(User user);
    Optional<MembershipRequest> findByUserAndStatus(User user, MembershipRequest.MembershipStatus status);
    boolean existsByUserAndStatus(User user, MembershipRequest.MembershipStatus status);
}
