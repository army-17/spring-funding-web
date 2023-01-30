package com.jsframe.wadizit.entity;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;


@Entity
@Data
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long memberNum;

    @Column(nullable = false, length = 20)
    private String id;

    @Column(nullable = false, length = 100)
    private String pwd;

    @Column(nullable = false, length = 8)
    private String nickname;

    @Column(nullable = false, length = 10)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 30)
    private String email;

    @Column(nullable = false)
    @ColumnDefault("0")
    private int grade;

    @Column(nullable = false)
    @ColumnDefault("0")
    private int point;
}
