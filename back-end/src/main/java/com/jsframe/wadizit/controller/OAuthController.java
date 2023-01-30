package com.jsframe.wadizit.controller;

import com.jsframe.wadizit.service.OAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;


@RestController
@RequestMapping("/oauth")
public class OAuthController {
    @Autowired
    private OAuthService oServ;

    // 카카오 로그인
    @GetMapping("/kakao")
    public ResponseEntity<?> kakaoCallBack(@Param("code") String code){
        HashMap<String, Object> result = new HashMap<String, Object>();
        try{
            String[] access_Token = oServ.getKakaoAccessToken(code);

            String token_data = access_Token[0];
            result = oServ.createKakaoUser(token_data);
            result.put("access_token", access_Token[0]);
        }catch(IOException e){
            e.printStackTrace();
        }

        return ResponseEntity.ok().body(result);
    }
}
