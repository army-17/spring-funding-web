package com.jsframe.wadizit.entity;

import com.jsframe.wadizit.dto.FundingRateInterface;
import lombok.Data;

import java.util.List;

@Data
public class FundingAndFileList {
    private Funding funding;
    private List<FundingFile> fundingFileList;
    // 목표금액 달성률 구하는 interface 추가
    private FundingRateInterface fundingRateInterface;
}
