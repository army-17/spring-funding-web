package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.entity.Payment;
import com.jsframe.wadizit.service.PaymentService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@Log
@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private PaymentService pServ;

    @GetMapping
    public void save(String oNum, String oName, String date,
                     HttpSession session) {
        log.info("save()");
        Member member = (Member) session.getAttribute("mem");
        pServ.save(oNum, oName, date, member);
    }

    @GetMapping("/list")
    public List<Payment> getPayment(HttpSession session) {
        log.info("getPayment()");
        Member member = (Member) session.getAttribute("mem");
        return pServ.getPayment(member);
    }
}
