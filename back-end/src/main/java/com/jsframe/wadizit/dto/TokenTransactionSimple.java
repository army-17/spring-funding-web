package com.jsframe.wadizit.dto;

import lombok.Data;

@Data
public class TokenTransactionSimple {
    private TokenOrderSimple cancelOrder;
    private TokenOrderSimple buyOrder;
    private TokenOrderSimple sellOrder;

    private long buyerMemberNum;
    private long buyerTokenAmount;
    private long buyerPoint;
    private long sellerMemberNum;
    private long sellerTokenAmount;
    private long sellerPoint;
}

