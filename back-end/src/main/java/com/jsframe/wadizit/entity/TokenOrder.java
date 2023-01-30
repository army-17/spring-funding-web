package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
public class TokenOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tokenOrderNum;

    @ManyToOne
    @JoinColumn(name = "tokenNum")
    private Token tokenNum;

    @ManyToOne
    @JoinColumn(name = "memberNum")
    private Member memberNum;

    // 1: 매수, 2: 매도, 3: 취소
    @Column(nullable = false)
    private long type;

    // 1: 대기, 2: 체결, 3: 취소
    @Column(nullable = false)
    private long status;

    @Column(nullable = false)
    private long price;

    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    private long remainAmount;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp createDate;
}
