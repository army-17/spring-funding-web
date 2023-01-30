package com.jsframe.wadizit.dto;

import com.jsframe.wadizit.entity.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Data
public class TokenInitRes {
    private Member member;
    private TokenSimple token;
    private long availableToken;
    private List<TokenOrderSimple> tokenOrderList;
    private List<TokenOrderSimple> myOrderList;
    private List<TokenTransactionSimple> tokenTransactionList;

    private Timestamp endDate;
    private String fundingStatus;
    private int retCode;
    private String errorMsg;

    public TokenInitRes() {
        this.retCode = 200;
    }
}
