package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Token;
import com.jsframe.wadizit.entity.TokenTransaction;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TokenTransactionRepository extends CrudRepository<TokenTransaction, Long> {
    List<TokenTransaction> findAllByTokenNumOrderByCreateDate(Token tokenNum);
}
