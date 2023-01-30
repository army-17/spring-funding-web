package com.jsframe.wadizit.dto;

import java.sql.Timestamp;

// current_amount/target_amount mapping 을 위해 만든 interface (목표금액 달성률 구하기)
public interface FundingRateInterface {
    Long getFundingNum();
    String getTitle();
    Long getTargetAmount();
    Long getCurrentAmount();
    Timestamp getStartDate();
    Timestamp getEndDate();
    String getCategory();
    String getStatus();
    Long getMemberNum();
    Double getCompleteRate();
}
