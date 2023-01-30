package com.jsframe.wadizit.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Goods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long goodsNum;

    @ManyToOne
    @JoinColumn(name = "fundingNum")
    private Funding fundingNum;

    @Column(nullable = false, length = 20)
    private String title;

    @Column(nullable = false)
    private long price;

    @Column(nullable = false, length = 50)
    private String desc1;

    @Column(nullable = false, length = 50)
    private String desc2;

    @Column(nullable = false, length = 50)
    private String desc3;

    //대표 이미지
    @Column(nullable = false, length = 100)
    private String imageFileName;
}
