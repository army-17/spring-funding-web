package com.jsframe.wadizit.service;

import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.FundingFile;
import com.jsframe.wadizit.repository.FundingFileRepository;
import com.jsframe.wadizit.repository.FundingRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;

@Log
@Service
@Transactional
public class FundingFileService {
    @Autowired
    private FundingRepository fRepo;

    @Autowired
    private FundingFileRepository ffRepo;

    //펀딩 첨부파일 삭제
    public String deleteFundingFile(Long fundingNum, HttpSession session) {
        log.info("deleteFundingFile()");
        String msg = null;

        Funding funding = new Funding();
        funding.setFundingNum(fundingNum);

        String realPath = session.getServletContext().getRealPath("/");
        realPath += "upload/";

        List<FundingFile> ffList = ffRepo.findByFundingNum(funding);

        try {
            for (FundingFile ff : ffList) {
                String delPath = realPath += ff.getSysName();
                File file = new File(realPath);

                if (file.exists()) {
                    file.delete();
                }
            }

            ffRepo.deleteByFundingNum(funding);

            msg = "삭제 성공";
        } catch (Exception e) {
            e.printStackTrace();
            msg = "삭제 실패";
        }

        return msg;

    }

    //펀딩 파일 업로드
    public String fileUpload(List<MultipartFile> files, HttpSession session, long fundingnum) throws Exception {
        log.info("fileUpload()");
        //파일 저장 위치 지정. session을 활용
        String realPath = session.getServletContext().getRealPath("/");
        log.info("realPath : " + realPath);

        //파일 업로드용 폴더를 자동으로 생성하도록 처리
        //업로드용 폴더 : upload
        realPath += "upload/";
        File folder = new File(realPath);
        if (folder.isDirectory() == false) {//폴더가 없을 경우 실행.
            folder.mkdir();//폴더 생성 메소드
        }

        for (int i=0; i<files.size(); i++) {
            log.info(files.size()+"size");
            MultipartFile mf = files.get(i);
            String orname = mf.getOriginalFilename();//업로드 파일명 가져오기
            if (orname.equals("")) {
                //업로드하는 파일이 없는 상태.
                return "업로드 파일 없음!";//파일 저장 처리 중지!
            }
            FundingFile ff = new FundingFile();

            if (i==0){
                ff.setFileType(0);
            }
            else if (i==1){
                ff.setFileType(1);
            }
            else
                ff.setFileType(2);


            //파일 정보를 저장(to fundingfiletbl)
            ff.setFundingNum(fRepo.findById(fundingnum).get());
            ff.setOriginName(orname);
            String sysname = System.currentTimeMillis()
                    + orname.substring(orname.lastIndexOf("."));
            ff.setSysName(sysname);

            //업로드하는 파일을 upload 폴더에 저장.
            File file = new File(realPath + sysname);

            //파일 저장(upload 폴더)
            mf.transferTo(file);

            //파일 정보를 DB에 저장
            ffRepo.save(ff);
        }
        return "업로드 성공!";
    }

    //파일 다운로드
    public ResponseEntity<Resource> fileDownlaod(long fundingFileNum, HttpSession session) throws IOException {
        log.info("fileDownload()");

        FundingFile ff = ffRepo.findById(fundingFileNum).get();

        //파일 저장경로 구하기
        String realpath = session.getServletContext().getRealPath("/");
        realpath += "upload/" + ff.getSysName();
        log.info(realpath);
        InputStreamResource fResource = new InputStreamResource(new FileInputStream(realpath));
        String fileName = URLEncoder.encode(ff.getOriginName(), "UTF-8");
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
                .cacheControl(CacheControl.noCache())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .body(fResource);
    }

    // 특정 게시글에 대한 파일 리스트 얻기
    public List<FundingFile> getFundingFileList(Long fundingNum) {
        log.info("getFundingFileList()");
        Funding funding = new Funding();
        funding.setFundingNum(fundingNum);
        List<FundingFile> ffList = ffRepo.findByFundingNum(funding);
        return ffList;
    }

    // 개별 파일 얻기
}
