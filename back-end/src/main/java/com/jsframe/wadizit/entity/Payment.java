package com.jsframe.wadizit.entity;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long payNum;

    @Column(nullable = false, length = 30)
    private String orderNum;

    @Column(nullable = false, length = 30)
    private String orderName;

    @Column(nullable = false)
    private Timestamp date;

    @ManyToOne
    @JoinColumn(name = "memberNum")
    private Member memberNum;
}
