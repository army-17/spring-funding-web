package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.entity.FundingFile;
import com.jsframe.wadizit.service.FundingFileService;
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
@RequestMapping("/funding/file")
public class FundingFileController {
    @Autowired
    private FundingFileService Serv;

    //펀딩 게시글 파일 첨부 기능 맵핑
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFundingFile(
             long fundingFileNum, HttpSession session) throws IOException {
        log.info("downloadFundingFile()");
        ResponseEntity<Resource> resp = Serv.fileDownlaod(fundingFileNum, session);
        return resp;
    }

    @GetMapping("/list")
    public Iterable<FundingFile> getFundingFileList(Long fundingNum) {
        log.info("getFundingList()");
        return Serv.getFundingFileList(fundingNum);
    }

    @DeleteMapping("")
    public String deleteFundingFile(Long fundingNum, HttpSession session) {
        log.info("deleteFundingFile()");
        return Serv.deleteFundingFile(fundingNum, session);
    }

    @PostMapping("")
    public String uploadFundingFile(List<MultipartFile> files, HttpSession session, long fundingNum) throws Exception {
        log.info("uploadFundingFile()");
        String upff = Serv.fileUpload(files, session, fundingNum);
        return upff;
    }
}
