package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.entity.*;
import com.jsframe.wadizit.repository.FundingRepository;
import com.jsframe.wadizit.repository.GoodsPurchaseRepository;
import com.jsframe.wadizit.repository.GoodsRepository;
import com.jsframe.wadizit.repository.TokenPossessionRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.List;
import java.util.Optional;

@Log
@RestController
@RequestMapping("/funding/goods")
public class GoodsController {
    @Autowired
    private GoodsRepository goodsRepo;
    @Autowired
    private GoodsPurchaseRepository goodsPurchaseRepo;
    @Autowired
    private FundingRepository fundingRepo;
    @Autowired
    private TokenPossessionRepository tokenPossessionRepo;

    private HttpStatus respStatus;

    @PostMapping("")
    public ResponseEntity create(@RequestBody Goods goods) {
        Goods ret = goodsRepo.save(goods);
        return ResponseEntity.status(HttpStatus.CREATED).body(ret);
    }

    @GetMapping("")
    public ResponseEntity read(long goodsNum) {
        Optional<Goods> ret = goodsRepo.findById(goodsNum);
        if (ret.isEmpty()) respStatus = HttpStatus.NO_CONTENT;
        else respStatus = HttpStatus.OK;
        return ResponseEntity.status(respStatus).body(ret);
    }

    @PutMapping("")
    public ResponseEntity update(@RequestBody Goods goods) {
        Goods ret = goodsRepo.save(goods);
        return ResponseEntity.status(HttpStatus.OK).body(ret);
    }

    @DeleteMapping("")
    public ResponseEntity delete(long goodsNum) {
        goodsRepo.deleteById(goodsNum);
        return ResponseEntity.status(HttpStatus.OK).body("");
    }

    @GetMapping("/list")
    public ResponseEntity getList(long fundingNum) {
        Funding funding = fundingRepo.findById(fundingNum).get();
        List<Goods> goodsList = goodsRepo.findAllByFundingNum(funding);
        if (goodsList.size() == 0) respStatus = HttpStatus.NO_CONTENT;
        else respStatus = HttpStatus.OK;
        return ResponseEntity.status(respStatus).body(goodsList);
    }

    @GetMapping("/purchase")
    public ResponseEntity purchase(long goodsNum, HttpSession session) {
        Goods goods = goodsRepo.findById(goodsNum).get();
        Member member = (Member)session.getAttribute("mem");
        if (member == null ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그인이 필요합니다");
        goods.getFundingNum().getFundingNum();

        MemberTokenID mtID = new MemberTokenID();
        mtID.setMemberNum(member.getMemberNum());
        mtID.setTokenNum(goods.getFundingNum().getFundingNum());

        Optional<TokenPossession> tpOp = tokenPossessionRepo.findById(mtID);
        if (tpOp.isPresent() == false) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("보유 토큰이 부족합니다");
        TokenPossession tp = tpOp.get();
        long balance = tp.getAmount() - goods.getPrice();
        if (balance < 0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("보유 토큰이 부족합니다");

        // 굿즈 구매 내역 저장
        GoodsPurchase gp = new GoodsPurchase();
        gp.setPrice(goods.getPrice());
        gp.setMemberNum(member);
        gp.setGoodsNum(goods);
        goodsPurchaseRepo.save(gp);

        tp.setAmount(balance);
        tokenPossessionRepo.save(tp);
        return ResponseEntity.status(HttpStatus.OK).body("success");
    }

    @PostMapping("/image")
    public ResponseEntity uploadImage(List<MultipartFile> files, long goodsNum, HttpSession session) throws Exception {
        String ret = "";
        // 파일 저장 위치 지정
        String realPath = session.getServletContext().getRealPath("/");
        realPath += "upload/";
        File folder = new File(realPath);
        if (!folder.isDirectory()) { // 폴더가 없을 경우 폴더 생성
            folder.mkdir();
        }

        for (MultipartFile mf : files) {
            String originName = mf.getOriginalFilename();
            if (originName.equals("")) { // 업로드할 파일이 없을 경우 정지
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("");
            }
            Goods goods = goodsRepo.findById(goodsNum).get();
            String sysName = System.currentTimeMillis()
                    + originName.substring(originName.lastIndexOf("."));
            goods.setImageFileName("/upload/" + sysName);
            ret = goods.getImageFileName();
            File file = new File(realPath + sysName);
            mf.transferTo(file); // upload 폴더에 파일 저장
            goodsRepo.save(goods);
        }
        return ResponseEntity.status(HttpStatus.OK).body(ret);
    }
}
