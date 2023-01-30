package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
public class Funding {
    //펀딩 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long fundingNum;

    //펀딩 제목
    @Column(nullable = false, length = 30)
    private String title;

    //목표 금액
    @Column(nullable = false)
    private long targetAmount;

    //현재 금액
    @Column(nullable = false)
    @ColumnDefault("0")
    private long currentAmount;

    //시작 날짜
    @Column(nullable = false)
    private Timestamp startDate;

    //종료 날짜
    @Column(nullable = false)
    private Timestamp endDate;

    //카테고리
    @Column(nullable = false, length = 20)
    @ColumnDefault("0")
    private String category;

    //상태(0:대기/1:승인/2:진행/3:종료/4:반려)
    @Column(nullable = false)
    @ColumnDefault("0")
    private String status;

    @ManyToOne
    @JoinColumn(name = "memberNum")
    //회원번호 (펀딩 신청자) 외래키
    private Member memberNum;
}
