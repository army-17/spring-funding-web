package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.entity.Payment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PaymentRepository extends CrudRepository<Payment, Long> {
    List<Payment> findByMemberNum(Member memberNum);
}
