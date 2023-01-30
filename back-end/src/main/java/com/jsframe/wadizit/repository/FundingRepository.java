package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.dto.FundingRateInterface;
import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public interface FundingRepository extends CrudRepository<Funding, Long> {
    List<Funding> findAllByMemberNum(Member member);

    // fundingNum 이 큰 순으로 정렬(최근등록순)
    Page<Funding> findByFundingNumGreaterThanOrderByFundingNumDesc(long fundingNum, Pageable pageable);

    // status 1(승인) or 2(진행) 중 fundingNum 이 큰 순으로 정렬(최근등록순)
    Page<Funding> findByStatusInAndFundingNumGreaterThanOrderByFundingNumDesc(List<String> status, long fundingNum, Pageable pageable);

    // status 1(승인) or 2(진행) 중  endDate 가 자신보다 크거나 같은 값 중 작은 순으로 정렬(마감임박순-종료제외)
    Page<Funding> findByStatusInAndEndDateGreaterThanEqualOrderByEndDateAsc(List<String> status, Date today, Pageable pageable);

    // status "종료" 중  endDate 가 자신보다 작은 값 중 작은 순으로 정렬(토큰거래활성화-종료)
    Page<Funding> findByStatusInAndEndDateLessThanOrderByEndDateDesc(List<String> endStatus, Date today, Pageable pageable);

    // status 1(승인) or 2(진행) 중 completeRate(current_amount/target_amount) 가 큰 순(목표금액 달성 순)
    @Query(value = "SELECT F.* FROM " +
            "(SELECT funding_num as fundingNum, title as title, target_amount as targetAmount, " +
            "current_amount as currentAmount, start_date as startDate, end_date as endDate, " +
            "category as category, status as status, member_num as memberNum, " +
            "current_amount/target_amount AS completeRate FROM funding ORDER BY completeRate DESC) F " +
            "WHERE status = '승인'"+
            " LIMIT :offset, :listCnt", nativeQuery = true)
    List<FundingRateInterface> findByCurrentAmountAndTargetAmountWithNativeQuery(@Param("offset") int offset, @Param("listCnt") int listCnt);

    Long countAllBy();

}
