package com.jsframe.wadizit.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberTokenID implements Serializable {
    private long memberNum;
    private long tokenNum;
}
