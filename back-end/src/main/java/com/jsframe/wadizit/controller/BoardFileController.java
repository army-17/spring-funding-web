package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.entity.BoardFile;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.service.BoardFileService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@Log
@RestController
@RequestMapping("/board/file")
public class BoardFileController {
    @Autowired
    private BoardFileService bfServ;

    @PostMapping("")
    public String upload(List<MultipartFile> files, HttpSession session, long boardNum) throws Exception {
        log.info("upload()");
        String msg = bfServ.upload(files, session, boardNum);
        return msg;
    }

    @GetMapping("")
    public BoardFile read(Long boardFileNum) {
        log.info("read()");
        return bfServ.read(boardFileNum);
    }

//    @PutMapping("update")
//    public String update(List<MultipartFile> files,
//                         HttpSession session, long boardNum) {
//        log.info("update()");
//        String msg = bfServ.update(files, session, boardNum);
//        return msg;
//    }

    @DeleteMapping("")
    public String delete(HttpSession sessionFile, long boardFileNum) {
        log.info("delete()");
        String msg = bfServ.delete(sessionFile, boardFileNum);
        return msg;
    }

    @GetMapping("list")
    public Iterable<BoardFile> getList(long boardNum) {
        log.info("getList()");
        return bfServ.getList(boardNum);
    }

    @GetMapping("download")
    public ResponseEntity<Resource> download(long boardFileNum, HttpSession session)
            throws IOException {
        log.info("download()");
        return bfServ.download(boardFileNum, session);
    }

    @DeleteMapping("deleteAll")
    public String deleteAll(long boardNum, HttpSession sessionFile, HttpSession session ) {
        log.info("deleteAll()");
        Member member = (Member) session.getAttribute("mem");
        String msg = bfServ.deleteAll(boardNum, sessionFile, member);
        return msg;
    }

//    @DeleteMapping("deleteList")
//    public String deleteList(List<MultipartFile> files, long boardNum, HttpSession sessionFile) throws Exception{
//        log.info("deleteList()");
//        String msg = bfServ.deleteList(files, boardNum,sessionFile);
//    }

}
