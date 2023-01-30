package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.entity.BoardComment;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.service.BoardCommentService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Log
@RestController
@RequestMapping("/board/comment")
public class BoardCommentController {
    @Autowired
    private BoardCommentService bcServ;

    @PostMapping("")
    public BoardComment create(@RequestBody BoardComment boardComment, Long boardNum, HttpSession session) {
        log.info("create()");
        Member member = (Member) session.getAttribute("mem");
        BoardComment bc = bcServ.create(boardComment, boardNum, member);
        return bc;
    }

    @GetMapping("")
    public BoardComment read(Long boardComNum) {
        log.info("read()");
        return bcServ.read(boardComNum);
    }

    @PutMapping("")
    public BoardComment update(@RequestBody BoardComment boardComment, HttpSession session, Long boardComNum) {
        log.info("update()");
        Member member = (Member) session.getAttribute("mem");
        BoardComment bc = bcServ.update(boardComment, member, boardComNum);
        return bc;
    }

    @DeleteMapping("")
    public String delete(HttpSession session, Long boardComNum) {
        log.info("delete()");
        Member member = (Member) session.getAttribute("mem");
        String msg = bcServ.delete(member, boardComNum);
        return msg;
    }

    @GetMapping("list")
    public Iterable<BoardComment> getList(Long boardNum) {
        log.info("getList()");
        return bcServ.getList(boardNum);
    }

    //게시글 댓글 전체 삭제
    @DeleteMapping("deleteAll")
    public String deleteAll(Long boardNum){
        log.info("deleteAll()");
        return bcServ.deleteAll(boardNum);
    }
}
