package com.jsframe.wadizit.entity;


import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;


@Entity
@Data
public class FundingComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long fundingComNum;

    @Column(nullable = false, length = 100)
    private String content;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp date;

    @ManyToOne
    @JoinColumn(name = "memberNum")
    private Member memberNum;

    @ManyToOne
    @JoinColumn(name = "fundingNum")
    private Funding fundingNum;

}
