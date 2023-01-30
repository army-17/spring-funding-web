package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.dto.TokenPossessionDto;
import com.jsframe.wadizit.entity.Member;
import com.jsframe.wadizit.entity.MemberTokenID;
import com.jsframe.wadizit.entity.Token;
import com.jsframe.wadizit.entity.TokenPossession;
import com.jsframe.wadizit.repository.TokenPossessionRepository;
import com.jsframe.wadizit.repository.TokenRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Log
@RestController
@RequestMapping("/token")
public class TokenController {
    @Autowired
    private TokenRepository tokenRepo;
    @Autowired
    private TokenPossessionRepository tokenPossessionRepo;
    private HttpStatus respStatus;

    @PostMapping("")
    public ResponseEntity create(@RequestBody Token token) {
        token.setParValue(100);
        Token ret = tokenRepo.save(token);
        return ResponseEntity.status(HttpStatus.CREATED).body(ret);
    }

    @GetMapping("")
    public ResponseEntity read(long tokenNum) {
        Optional<Token> ret = tokenRepo.findById(tokenNum);
        if (ret.isEmpty()) respStatus = HttpStatus.NO_CONTENT;
        else respStatus = HttpStatus.OK;
        return ResponseEntity.status(respStatus).body(ret);
    }

    @GetMapping("/amount")
    public ResponseEntity readMyToken(long tokenNum, HttpSession session) {
        Optional<Token> ret = tokenRepo.findById(tokenNum);
        Member member = (Member)session.getAttribute("mem");

        TokenPossession tp = tokenPossessionRepo.findByMemberNumAndTokenNum(member.getMemberNum(), tokenNum);
        if (tp == null) {
            return ResponseEntity.status(200).body(0);
        }
        return ResponseEntity.status(200).body(tp.getAmount());
    }

    @PutMapping("")
    public ResponseEntity update(@RequestBody Token token) {
        Token ret = tokenRepo.save(token);
        return ResponseEntity.status(HttpStatus.OK).body(ret);
    }

    @DeleteMapping("")
    public ResponseEntity delete(long tokenNum) {
        tokenRepo.deleteById(tokenNum);
        return ResponseEntity.status(HttpStatus.OK).body("");
    }

    @GetMapping("/list")
    public ResponseEntity getList() {
        List<Token> tokenList = tokenRepo.findAll();
        if (tokenList.size() == 0) respStatus = HttpStatus.NO_CONTENT;
        else respStatus = HttpStatus.OK;
        return ResponseEntity.status(respStatus).body(tokenList);
    }

    @GetMapping("/list/possession")
    public ResponseEntity getPossessionList(HttpSession session) {
        Member member = (Member)session.getAttribute("mem");
        List<TokenPossession> tpList = tokenPossessionRepo.findAllByMemberNum(member.getMemberNum());
        List<TokenPossessionDto> tpDtoList = new ArrayList<>();
        for (int i=0; i<tpList.size(); i++) {
            Token token = tokenRepo.findById(tpList.get(i).getTokenNum()).get();
            TokenPossessionDto tpDto = new TokenPossessionDto();
            tpDto.setTokenNum(token.getTokenNum());
            tpDto.setTokenSymbol(token.getName());
            tpDto.setTokenAmount(tpList.get(i).getAmount());
            tpDtoList.add(tpDto);
        }
        return ResponseEntity.status(200).body(tpDtoList);
    }

    @GetMapping("/fundToken")
    public Token getfundToken(Long fundingNum) {
        log.info("getfundToken()");
        Token tData = tokenRepo.findById(fundingNum).get();
        return tData;
    }
}
