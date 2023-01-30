package com.jsframe.wadizit.service;

import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.entity.Payment;
import com.jsframe.wadizit.repository.PaymentRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@Log
public class PaymentService {
    @Autowired
    private PaymentRepository pRepo;

    public void save(String oNum, String oName, String date, Member member) {
        log.info("save()");

        Payment payment = new Payment();
        Timestamp tp = Timestamp.valueOf(date);

        try {
            payment.setOrderNum(oNum);
            payment.setOrderName(oName);
            payment.setMemberNum(member);
            payment.setDate(tp);
            pRepo.save(payment);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Payment> getPayment(Member member) {
        return pRepo.findByMemberNum(member);
    }
}
