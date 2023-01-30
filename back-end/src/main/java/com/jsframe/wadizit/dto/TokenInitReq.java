package com.jsframe.wadizit.dto;

import lombok.Data;

@Data
public class TokenInitReq {
    private long memberNum;
    private long tokenNum;
}