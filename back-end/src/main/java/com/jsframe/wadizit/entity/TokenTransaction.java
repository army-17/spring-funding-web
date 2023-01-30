package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
public class TokenTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tokenTransNum;

    @ManyToOne
    @JoinColumn(name = "tokenNum")
    private Token tokenNum;

    @ManyToOne
    @JoinColumn(name = "buyTokenOrderNum")
    private TokenOrder buyTokenOrderNum;

    @ManyToOne
    @JoinColumn(name = "sellTokenOrderNum")
    private TokenOrder sellTokenOrderNum;

    @Column(nullable = false)
    private long price;

    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp createDate;
}
