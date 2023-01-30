package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.FundingComment;
import org.springframework.data.repository.CrudRepository;

public interface FundingCommentRepository extends CrudRepository<FundingComment, Long> {

//    Iterable<FundingComment> findAllByFundingNum(Funding fData);

    Iterable<FundingComment> findAllByFundingNumOrderByFundingComNumDesc(Funding fData);
}
