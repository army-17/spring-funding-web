package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.entity.MemberTokenID;
import com.jsframe.wadizit.entity.Token;
import com.jsframe.wadizit.entity.TokenPossession;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TokenPossessionRepository extends CrudRepository<TokenPossession, MemberTokenID> {
    TokenPossession findByMemberNumAndTokenNum(long memberNum, long tokenNum);

    List<TokenPossession> findAllByMemberNum(long memberNum);
}
