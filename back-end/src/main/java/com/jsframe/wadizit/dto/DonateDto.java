package com.jsframe.wadizit.dto;

import com.jsframe.wadizit.entity.Funding;
import lombok.Data;

@Data
public class DonateDto {
    private long donateNum;
    private String fundingTitle;
    private long donateAmount;
    private long fundingNum;
}
