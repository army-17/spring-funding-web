package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.entity.Board;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.service.BoardService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Log
@RestController
@RequestMapping("/board")
public class BoardController {
    @Autowired
    private BoardService Serv;

    //게시글 생성
    @PostMapping("")
    public long create(@RequestBody Board board, HttpSession session){
        log.info("create()");
        Member member = (Member) session.getAttribute("mem");
        long boardNum = Serv.create(board, member);
        return boardNum;
    }

    //게시글 읽기
    @GetMapping("")
    public Board read(Long boardNum) {
        log.info("read()");
        return Serv.read(boardNum);
    }

    //게시글 수정
    @PutMapping("") //Board board는 수정하기 위해 작성한 내용, boardNum은 기존에 있던 게시판을 불러오기 위한 매개변수
    public String update(@RequestBody Board board, Long boardNum, HttpSession session) {
        log.info("update()");
        Member member = (Member) session.getAttribute("mem");

        return Serv.update(board, boardNum, member);
    }

    //게시글 삭제
    @DeleteMapping("")
    public String delete(Long boardNum, HttpSession session) {
        log.info("delete()");
        Member member = (Member) session.getAttribute("mem");
        log.info("" + member.getMemberNum());
        return Serv.delete(boardNum, member);
    }

    //게시글 리스트
    @GetMapping("/list")
    public Iterable<Board> getList(Board board) {
        log.info("getList()");
        return Serv.getList(board);
    }

    // 페이징 처리 + 게시글 전체 리스트
    @GetMapping("/page")
    public Map<String, Object> getPage(@RequestParam Integer pageNum,@RequestParam Integer listCntNum) {
        log.info("getPage()");
        log.info("리스트 몇개" + listCntNum);
        return Serv.getBoardPage(pageNum, listCntNum);
    }
}
