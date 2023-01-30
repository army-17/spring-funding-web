package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.dto.DonateDto;
import com.jsframe.wadizit.entity.Donate;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.service.DonateService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Log
@RestController
@RequestMapping("/donate")
public class DonateController {
    @Autowired
    private DonateService Serv;

    @PostMapping("")
    public String create(@RequestBody Donate donate, long fundingNum, HttpSession session) {
        log.info("ddd" + donate);
        Member member = (Member) session.getAttribute("mem");
        return Serv.createDonate(donate, fundingNum, member);
    }

    @PutMapping("")
    public String update(@RequestBody Donate donate, HttpSession session) {
        return Serv.updateDonate(donate, session);
    }

    @GetMapping("")
    public Donate read(Long donateNum) {
        return Serv.readDonate(donateNum);
    }

    @DeleteMapping("")
    public String delete(Long donateNum) {
        return Serv.deleteDonate(donateNum);
    }

    @GetMapping("/dlist")
    public List<DonateDto> getMyList(Donate donate, HttpSession session){
        List<Donate> donateList = Serv.getMyList(donate, session);
        List<DonateDto> donateDtoList = new ArrayList<>();
        for (int i=0; i<donateList.size(); i++) {
            DonateDto dd = new DonateDto();
            dd.setDonateNum(donateList.get(i).getDonateNum());
            dd.setDonateAmount(donateList.get(i).getPayAmount());
            dd.setFundingNum(donateList.get(i).getFundingNum().getFundingNum());
            dd.setFundingTitle(donateList.get(i).getFundingNum().getTitle());
            donateDtoList.add(dd);
        }
        return donateDtoList;
    }

    //펀딩 후원자 리스트 출력
    @GetMapping("/getFundingPerson")
    public List<Integer> getFundingPerson(long fundingNum){
        log.info("getFundingPerson()");
        return Serv.getFundingPerson(fundingNum);
    }
}
