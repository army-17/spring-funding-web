package com.jsframe.wadizit.dto;

import com.jsframe.wadizit.entity.Token;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class TokenSimple {
    private long fundingNum;
    private String name;
    private long currentPrice;
    private long listingPrice;
    private long parValue;
    private Timestamp createDate;

    public TokenSimple(Token token) {
        this.fundingNum = token.getTokenNum();
        this.name = token.getName();
        this.currentPrice = token.getCurrentPrice();
        this.listingPrice = token.getListingPrice();
        this.parValue = token.getParValue();
        this.createDate = token.getCreateDate();
    }
}
