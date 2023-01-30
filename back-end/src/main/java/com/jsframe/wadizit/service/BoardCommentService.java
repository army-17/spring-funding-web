package com.jsframe.wadizit.service;

import com.jsframe.wadizit.entity.Board;
import com.jsframe.wadizit.entity.BoardComment;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.repository.BoardCommentRepository;
import com.jsframe.wadizit.repository.BoardRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log
@Service
public class BoardCommentService {
    @Autowired
    private BoardCommentRepository bcRepo;
    @Autowired
    private BoardRepository bRepo;

    // 게시글 댓글 작성
    public BoardComment create(BoardComment boardComment, Long boardNum, Member member) {
        log.info("create()");
        BoardComment bc = null;

        try {
            Board bNum = bRepo.findById(boardNum).get();
            boardComment.setBoardNum(bNum);
            boardComment.setMemberNum(member);
            bc = bcRepo.save(boardComment);

            log.info("boardComNum : " + boardComment.getBoardComNum());
            log.info("memberNum : " + boardComment.getMemberNum());
            log.info("content : " + boardComment.getContent());
            log.info("date : " + boardComment.getDate());
        } catch (Exception e) {
            log.info(e.getMessage());
        }

        return bc;
    }

    // 게시글 댓글 상세 출력 => 피료없음
    public BoardComment read(Long boardComNum) {
        log.info("read()");

        BoardComment boardComment = bcRepo.findById(boardComNum).get();
        log.info("댓글 : " + boardComment.getContent());

        return boardComment;
    }

    // 게시글 댓글 수정
    public BoardComment update(BoardComment boardComment, Member member, Long boardComNum) {
        log.info("update()");
        BoardComment bc = null;
        log.info("content: " + boardComment.getContent());
        log.info("session member: " + member.getMemberNum());

        BoardComment bcData = bcRepo.findById(boardComNum).get();
        long mNum = (bcData.getMemberNum()).getMemberNum();

        try {
            if (member.getMemberNum() == mNum) {
                bcData.setContent(boardComment.getContent());
                bc = bcRepo.save(bcData);
            } else {
                throw new Exception("작성자가 아닙니다");
            }
        } catch (Exception e) {
            log.info(e.toString());
            log.info("exception");
        }
        return bc;
    }

    // 게시글 댓글 삭제
    public String delete(Member member, Long boardComNum) {
        log.info("delete()");
        String msg = null;

        BoardComment bcData = bcRepo.findById(boardComNum).get();
        long mNum = (bcData.getMemberNum()).getMemberNum();

        try {
            if (member.getMemberNum() == mNum) {
                bcRepo.deleteById(boardComNum);
                msg = "댓글 삭제를 완료했습니다.";
            } else {
                msg = "작성자만 삭제할 수 있습니다.";
            }

        } catch (Exception e) {
            log.info(e.getMessage());
            msg = "댓글 삭제를 실패했습니다.";
        }

        return msg;
    }

    // 게시글 댓글 리스트 출력
    public Iterable<BoardComment> getList(Long boardNum) {
        log.info("getList()");
        Board bNum = bRepo.findById(boardNum).get();
        Iterable<BoardComment> bcList = bcRepo.findAllByBoardNumOrderByBoardComNumDesc(bNum);

        return bcList;
    }

    // 게시글 댓글 리스트 삭제
    public String deleteAll(Long boardNum) {
        log.info("deleteAll()");
        String msg = null;


        try {
            Board bData = (Board) bRepo.findById(boardNum).get();
            Iterable<BoardComment> bcList = bcRepo.findAllByBoardNum(bData);

            int count = 0;
            for(BoardComment bc : bcList){
                count++;
            }
            if(count != 0){
                bcRepo.deleteAllByBoardNum(bData);
                msg = "댓글 전체 삭제";
            } else {
                msg = "댓글없음";
            }

        } catch (Exception e) {
            e.printStackTrace();
            msg = "댓글 전체삭제 실패";
        }
        return msg;
    }
}
