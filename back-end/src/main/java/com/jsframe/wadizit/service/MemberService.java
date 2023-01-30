package com.jsframe.wadizit.service;

import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.repository.MemberRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@Log
public class MemberService {
    @Autowired
    private MemberRepository mRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // 회원가입 (create)
    public boolean join(Member member) {
        log.info("join()");
        boolean result = false;

        String ePwd = encoder.encode(member.getPwd());// 비밀번호 암호화 처리
        member.setPwd(ePwd); // 암호화된 비밀번호로 변경

        try {
            mRepo.save(member);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
            result = false;
        }
        return result;
    }

    // 로그인
    public Map<Object, Object> login(Member member, HttpSession session) {
        log.info("login()");
        Map<Object, Object> result= new HashMap<>();

        Member m = mRepo.findMemberById(member.getId());
        if (m != null) {//입력한 회원의 아이디가 있음
            String ePwd = m.getPwd();
            if (encoder.matches(member.getPwd(), ePwd)) {
                member = mRepo.findMemberById(member.getId());
                // 세션에 로그인 성공 정보 저장
                session.setAttribute("mem", member);
                result.put("success", true);
                result.put("nickName", member.getNickname());
                result.put("memberNum", member.getMemberNum());
                result.put("grade", member.getGrade());

            } else {// 비밀번호가 맞지 않는 경우
                result.put("success", false);
            }
        } else {//잘못된 아이디 입력
            result.put("success", false);
        }
        return result;
    }

    // 회원조회 (read)
    public Member getMember(Long MemberNum) {
        log.info("getMember()");

        Member member = mRepo.findById(MemberNum).get();
        log.info("출력 : " + member.getMemberNum());

        return member;
    }

    // 회원정보 수정 (update)
    public boolean updateMember(Member member, Member mb) {
        log.info("updateMember()");
        boolean result = false;

        try {
            String ePwd = encoder.encode(member.getPwd());
            mb.setPwd(ePwd);

            mb.setNickname(member.getNickname());
            mb.setName(member.getName());
            mb.setPhone(member.getPhone());
            mb.setEmail(member.getEmail());

            mRepo.save(mb);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
            result = false;
        }

        return result;
    }

    // 회원탈퇴 (delete)
    public boolean deleteMember(Long MemberNum) {
        log.info("deleteMember()");
        boolean result = false;

        try {
            mRepo.deleteById(MemberNum);
            result = true;
        } catch (Exception e) {
            result = false;
        }
        return result;
    }

    // countMemberById가 0이 아니면 중복
    public int checkId(String id) {
        log.info("checkId");
        return mRepo.countMemberById(id);
    }

    // countMemberByNickname이 0이 아니면 중복
    public int checkNickname(String nickname) {
        log.info("checkNickname");
        return mRepo.countMemberByNickname(nickname);
    }

//    public List<Member> findAll() {
//        log.info("findAll");
//        return mRepo.findAll();
//    }

    public void point(Member member, int point) {
        log.info("point()");

        int memPoint = member.getPoint();

        if (point == 10000) { point += 500; }
        else if (point == 50000) { point += 3000; }
        else if (point == 100000) { point += 7000; }

        int resPoint = memPoint + point;

        try {
            member.setPoint(resPoint);
            mRepo.save(member);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 페이징 처리 + 멤버 전체 리스트
    public Map<String, Object> getMemberPage(Integer pageNum) {
        log.info("getMemberPage()");

        if (pageNum == null) {
            pageNum = 1;
        }

        int listCnt = 5; // 페이지 당 보여질 개수

        // 페이징 조건 생성
        Pageable pb = PageRequest.of((pageNum - 1), listCnt,
                Sort.Direction.DESC, "memberNum");

        Page<Member> result = mRepo.findByMemberNumGreaterThanOrderByMemberNumAsc(0L, pb);
        List<Member> mList = result.getContent();
        int totalPage = result.getTotalPages();

        Map<String, Object> res = new HashMap<>();
        res.put("totalPage", totalPage);
        res.put("pageNum", pageNum);
        res.put("mList", mList);
        res.put("end", false);

        // 마지막 페이지일 경우
        if (totalPage == pageNum) {
            res.put("end", true);
        }

        return res;
    }
}
