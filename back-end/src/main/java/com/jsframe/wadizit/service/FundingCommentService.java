package com.jsframe.wadizit.service;


import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.FundingComment;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.repository.FundingCommentRepository;
import com.jsframe.wadizit.repository.FundingRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Log
public class FundingCommentService {
    @Autowired
    private FundingRepository fRepo;

    @Autowired
    private FundingCommentRepository fcRepo;



    public FundingComment create(FundingComment fundCom, Member member, Long fundingNum) {
        log.info("create()");
        Funding funding = fRepo.findById(fundingNum).get();
        fundCom.setFundingNum(funding);
        fundCom.setMemberNum(member);

        try{
            fcRepo.save(fundCom);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return fundCom;
    }

    public FundingComment read(Long fComNum) {
        log.info("read()");

        FundingComment fCom = fcRepo.findById(fComNum).get();
        return fCom;
    }

    public Iterable<FundingComment> getList(Long fundingNum) {
        log.info("getList()");
        log.info(""+fundingNum);
        Funding fData =(Funding) fRepo.findById(fundingNum).get();
        Iterable<FundingComment> fComList = fcRepo.findAllByFundingNumOrderByFundingComNumDesc(fData);

        return fComList;
    }

    public String delete(Long fundingComNum, Member member) {
        log.info("delete()");
        String msg = null;

        //로그인한 사람 정보
        long loginPerson = member.getMemberNum();
        //댓글 작성자 정보(memberNum)
        FundingComment fCom = fcRepo.findById(fundingComNum).get();
        long writer = (fCom.getMemberNum()).getMemberNum();

        if (loginPerson == writer) {
            try {
                fcRepo.deleteById(fundingComNum);
                msg = "댓글 삭제 성공";
            } catch (Exception e) {
                msg = "댓글 삭제 실패";
            }

        } else {
            msg = "댓글 작성자만 삭제 가능합니다.";
        }
        return msg;
    }

    public FundingComment update(FundingComment fCom, Long fundingComNum, Member member) {
        log.info("update()");
        FundingComment fc = null;

        if (member == null) {
            log.info("로그인 필요!");
            return fc;
        }

        //로그인한 사람 정보
        long loginPerson = member.getMemberNum();
        //댓글 작성자
        FundingComment fComData = fcRepo.findById(fundingComNum).get();
        long writer = (fComData.getMemberNum()).getMemberNum();

        if (loginPerson == writer) {
            try {
                fComData.setContent(fCom.getContent());
                log.info("fComData.setContent(fCom.getContent())");
                fc = fcRepo.save(fComData);

            } catch (Exception e) {
                log.info(e.getMessage());
            }
        } else {
            log.info("댓글 작성자만 수정 가능합니다.");
        }
        return fc;
    }
}
