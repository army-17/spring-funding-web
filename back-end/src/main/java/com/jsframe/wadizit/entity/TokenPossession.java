package com.jsframe.wadizit.entity;

import lombok.Data;

import javax.persistence.*;


@Data
@Entity
@IdClass(MemberTokenID.class)
public class TokenPossession {
    @Id
    @JoinColumn(name = "memberNum")
    private long memberNum;

    @Id
    @JoinColumn(name = "tokenNum")
    private long tokenNum;

    @Column(nullable = false)
    private long amount;
}
