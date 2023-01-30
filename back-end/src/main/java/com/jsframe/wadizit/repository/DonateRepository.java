package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Donate;
import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.Member;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DonateRepository extends CrudRepository<Donate, Long> {
    List<Donate> findAllByMemberNum(Member member);

    List<Donate> findAllByFundingNum(long fundingNum);

    @Query(value = "SELECT DISTINCT member_num FROM donate WHERE funding_num= :fundingNum", nativeQuery = true)
    List<Integer> findDistinctByFundingNumWithNativeQuery(long fundingNum);


//    @Query(value = "SELECT DISTINCT member_num FROM donate WHERE funding_num= ?",
//    nativeQuery = true)
//    List<Member> findAllDonaters(long fundingNum);
}
