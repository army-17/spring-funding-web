package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
public class GoodsPurchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long goodsPurchaseNum;

    @ManyToOne
    @JoinColumn(name = "memberNum")
    private Member memberNum;

    @ManyToOne
    @JoinColumn(name = "goodsNum")
    private Goods goodsNum;

    @Column(nullable = false)
    private long price;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp date;
}
