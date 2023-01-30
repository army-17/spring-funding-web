package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
public class BoardComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long boardComNum;

    @ManyToOne
    @JoinColumn(name = "memberNum")
    private Member memberNum;

    @ManyToOne
    @JoinColumn(name = "boardNum")
    private Board boardNum;

    @Column(nullable = false, length = 100)
    private String content;

    @Column(nullable = false)
    @CreationTimestamp
    private Timestamp date;
}
