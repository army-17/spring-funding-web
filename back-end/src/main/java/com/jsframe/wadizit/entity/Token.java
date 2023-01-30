package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
public class Token {
    @Id
    private long tokenNum;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    private long currentPrice;

    @Column(nullable = false)
    private long listingPrice;

    @Column(nullable = false)
    @ColumnDefault("100")
    private long parValue;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp createDate;
}
