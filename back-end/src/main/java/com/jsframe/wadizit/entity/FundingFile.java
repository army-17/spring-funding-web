package com.jsframe.wadizit.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class FundingFile {
    //파일 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long fundingFileNum;

    //파일 구분(0:사업자등록증 /1 : 대표이미지 / 2 : 상세정보 이미지)
    @Column(nullable = false)
    private int fileType;

    //파일 원본 이름
    @Column(nullable = false, length = 100)
    private String originName;

    //파일 저장 이름
    @Column(nullable = false, length = 100)
    private String sysName;

    @ManyToOne
    @JoinColumn(name = "fundingNum")
    //펀딩 번호 (외래키)
    private Funding fundingNum;

}
