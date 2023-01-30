package com.jsframe.wadizit.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class TokenOrderRes {
    private int retCode;
    private String errorMsg;
    private List<TokenTransactionSimple> txList;

    public TokenOrderRes () {
        this.retCode = 200;
        this.txList = new ArrayList<>();
    }

    public void addTransaction(TokenTransactionSimple txs) {
        this.txList.add(txs);
    }
}
