package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.entity.Token;
import com.jsframe.wadizit.entity.TokenOrder;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TokenOrderRepository extends CrudRepository<TokenOrder, Long> {
    List<TokenOrder> findAllByStatusEqualsAndTokenNumOrderByCreateDate(long status, Token tokenNum);
    List<TokenOrder> findAllByTypeEqualsAndStatusEqualsAndPriceLessThanEqualOrderByPrice(long type, long status, long price);
    List<TokenOrder> findAllByTypeEqualsAndStatusEqualsAndPriceGreaterThanEqualOrderByPriceDesc(long type, long status, long price);
    List<TokenOrder> findAllByStatusEqualsAndMemberNum(long status, Member memberNum);
}
