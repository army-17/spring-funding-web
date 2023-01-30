package com.jsframe.wadizit.dto;

import lombok.Data;

@Data
public class TokenPossessionDto {
    private long tokenNum;
    private String tokenSymbol;
    private long tokenAmount;
}
