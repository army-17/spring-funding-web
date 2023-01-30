package com.jsframe.wadizit.service;

import com.jsframe.wadizit.dto.FundingRateInterface;
import com.jsframe.wadizit.entity.FundingAndFileList;
import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.FundingFile;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.repository.DonateRepository;
import com.jsframe.wadizit.repository.FundingRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.*;

@Service
@Log
public class FundingService {

    @Autowired
    private FundingRepository fRepo;
    @Autowired
    private FundingFileService ffServ;

    @Autowired
    private DonateRepository dRepo;

    //펀딩 게시글 생성
    public long create(Funding funding, Member member) {
        log.info("create()");
        long fundingNum = 0;

        log.info("" + funding.getFundingNum());
        //log.info(funding.getContent());
        log.info(funding.getTitle());

        try {
            funding.setMemberNum(member);
            fRepo.save(funding);
            fundingNum = funding.getFundingNum();
        } catch (Exception e) {
            log.info(e.getMessage());
            fundingNum = 0;
        }

        return fundingNum;

    }

    //펀딩 게시글 읽기
    public Funding getFunding(Long fundingNum) {
        log.info("getFunding()");
        Funding fund = fRepo.findById(fundingNum).get();
        log.info("출력 : " + fund.getFundingNum());
        return fund;

    }

    //펀딩 게시글 삭제
    public String deleteFunding(Long fundingNum) {
        log.info("deleteFunding()");
        String msg = null;

        try {
            fRepo.deleteById(fundingNum);
            msg = "삭제 성공";
        } catch (Exception e) {
            msg = "삭제 실패";
        }
        return msg;

    }

    //펀딩 게시글 리스트(ALL)
    public Iterable<Funding> getList(Funding funding) {
        log.info("getList()");
        Iterable<Funding> fList = fRepo.findAll();

        return fList;
    }

    //펀딩 게시글 수정
    public String update(Funding funding, Long fundingNum, Member member) {
        log.info("update()");
        String msg = null;

        //로그인한 사람의 memberNum
        long loginPerson = member.getMemberNum();
        // 로그인한 사람의 grade
        int logGrade = member.getGrade();
        //펀드 작성자의 memberNum
        Funding fund3 = fRepo.findById(fundingNum).get();
        long fundWriter = (fund3.getMemberNum()).getMemberNum();

        log.info("" + fund3.getMemberNum().getMemberNum());
        Funding funding3 = fRepo.findById(fundingNum).get();
        funding3.setTitle(funding.getTitle());

        if (logGrade == 1 || loginPerson == fundWriter) {

            fund3.setTitle(funding.getTitle());
            fund3.setCategory(funding.getCategory());
            fund3.setStartDate(funding.getStartDate());
            fund3.setEndDate(funding.getEndDate());
            fund3.setStatus(funding.getStatus());

            try {
                fRepo.save(funding3);
                msg = "수정 성공";
            } catch (Exception e) {
                msg = "수정 실패";
            }
        } else {
            msg = "작성자만 수정 가능합니다";
        }

        return msg;

    }


    //펀딩 생성 내역 리스트(로그인한 유저)
    public List<Funding> getMyList(Funding funding, HttpSession session) {
        Member member = (Member) session.getAttribute("mem");
        funding.setMemberNum(member);
        List<Funding> myList = fRepo.findAllByMemberNum(member);
        return myList;
    }


    //메인 페이지 펀딩리스트 처리
    public Map<String, Object> getFundingPage(Integer pageNum ,int sort) {
        log.info("getFundingPage()");
        Page<Funding> result = null;
        Date today = new Date();
        List<String> status = new ArrayList<String>();
        status.add("승인");
        // status.add("2");
        List<String> endStatus = new ArrayList<String>();
        endStatus.add("종료");


        if (pageNum == null) {//처음에 접속했을 때는 pageNum이 넘어오지 않는다.
            pageNum = 1;
        }
        int listCnt = 9;//페이지 당 보여질 게시글의 개수.

            // 조건별 페이징 조건 생성
            if (sort == 0) { // 최근등록순 (defaultValue(select value = 0) 일 때)
                Pageable pb = PageRequest.of((pageNum - 1), listCnt,
                        Sort.Direction.DESC, "fundingNum");

                result = fRepo.findByStatusInAndFundingNumGreaterThanOrderByFundingNumDesc(status, 0L, pb);
            }
            if (sort == 1) { // 마감임박순
                Pageable pb = PageRequest.of((pageNum - 1), listCnt,
                        Sort.Direction.DESC, "endDate");

                result = fRepo.findByStatusInAndEndDateGreaterThanEqualOrderByEndDateAsc(status, today, pb);
            }

            // 페이징 쿼리를 활용하여 페이징 처리
            if (sort == 2) { // 목표금액 달성순(current_amount/target_amount)
                int offset = (pageNum - 1) * listCnt;
                List<FundingRateInterface> fList = fRepo.findByCurrentAmountAndTargetAmountWithNativeQuery(offset, listCnt);
                Long totalPage = fRepo.countAllBy();
                List<FundingAndFileList> fffList = new ArrayList<>();
                for (int i = 0; i < fList.size(); i++) {
                    FundingRateInterface f = fList.get(i);
                    Long fundingRateNum = f.getFundingNum();

                    List<FundingFile> ffList = ffServ.getFundingFileList(fundingRateNum);
                    FundingAndFileList fff = new FundingAndFileList();
                    fff.setFundingRateInterface(f);
                    fff.setFundingFileList(ffList);
                    fffList.add(fff);
                }
                Map<String, Object> res = new HashMap<>();
                res.put("totalPage", totalPage);
                res.put("pageNum", pageNum);
                res.put("fffList", fffList);
                res.put("end", false);
                res.put("sort", sort);

                // 마지막 페이지일 때
                if (totalPage.intValue() <= pageNum * listCnt) {
                    res.put("end", true);
                }
                return res;
            }

            if (sort == 3) { // 종료된 펀딩(=토큰 거래 진행 중)
                Pageable pb = PageRequest.of((pageNum - 1), listCnt,
                        Sort.Direction.DESC, "endDate");

                result = fRepo.findByStatusInAndEndDateLessThanOrderByEndDateDesc(endStatus, today, pb);
            }

            List<Funding> fList = result.getContent();
            int totalPage = result.getTotalPages();

            //funding list에 fundingfilelist 추가
            List<FundingAndFileList> fffList = new ArrayList<>();

            // Funding List 순회
            // 각 Funding 객체에 해당하는 File 리스트얻기
            // FFF 객체 생성
            for (int i = 0; i < fList.size(); i++) {
                Funding f = fList.get(i);
                List<FundingFile> ffList = ffServ.getFundingFileList(f.getFundingNum());
                FundingAndFileList fff = new FundingAndFileList();
                fff.setFunding(f);
                fff.setFundingFileList(ffList);
                fffList.add(fff);
            }

            // FFF 객체에 펀딩 객체와 파일리스트 저장
            Map<String, Object> res = new HashMap<>();
            res.put("totalPage", totalPage);
            res.put("pageNum", pageNum);
            res.put("fffList", fffList);
            res.put("end", false);
            res.put("sort", sort);

            // 마지막 페이지일 때
            if (totalPage == pageNum) {
                res.put("end", true);
            }

            return res;

    }

    // 관리자용 펀딩 페이징
    public Map<String, Object> getAdminFundingPage(Integer pageNum) {
        log.info("getFundingPage()");

        if(pageNum == null){//처음에 접속했을 때는 pageNum이 넘어오지 않는다.
            pageNum = 1;
        }

        int listCnt = 5;//페이지 당 보여질 게시글의 개수.
        //페이징 조건 생성
        Pageable pb = PageRequest.of((pageNum - 1), listCnt,
                Sort.Direction.DESC, "fundingNum");

        Page<Funding> result = fRepo.findByFundingNumGreaterThanOrderByFundingNumDesc(0L, pb);
        List<Funding> fList = result.getContent();
        int totalPage = result.getTotalPages();

        Map<String, Object> res = new HashMap<>();
        res.put("totalPage", totalPage);
        res.put("pageNum", pageNum);
        res.put("fList", fList);
        res.put("end", false);

        // 마지막 페이지일 때
        if(totalPage == pageNum) {
            res.put("end", true);
        }

        return res;
    }



}


