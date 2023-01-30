package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MemberRepository extends CrudRepository<Member, Long> {
    Member findMemberById(String id);

    List<Member> findAll();

    int countMemberById(String id);

    int countMemberByNickname(String nickname);

    Page<Member> findByMemberNumGreaterThanOrderByMemberNumAsc(long memberNum, Pageable pageable);

}
