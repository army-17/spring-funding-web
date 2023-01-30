package com.jsframe.wadizit.dto;

import com.jsframe.wadizit.entity.TokenOrder;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class TokenOrderSimple {
    private long memberNum;
    private long orderNum;
    private long type;
    private long price;
    private long amount;
    private long remainAmount;

    public TokenOrderSimple(){}

    public TokenOrderSimple(TokenOrder order) {
        this.memberNum = order.getMemberNum().getMemberNum();
        this.orderNum = order.getTokenOrderNum();
        this.type = order.getType();
        this.price = order.getPrice();
        this.amount = order.getAmount();
        this.remainAmount = order.getRemainAmount();
    }

    public static List<TokenOrderSimple> convertSimple(List<TokenOrder> in) {
        List<TokenOrderSimple> out = new ArrayList<>();

        for (int i=0; i<in.size(); i++) {
            TokenOrder to = in.get(i);
            TokenOrderSimple tos = new TokenOrderSimple();
            tos.setMemberNum(to.getMemberNum().getMemberNum());
            tos.setOrderNum(to.getTokenOrderNum());
            tos.setType(to.getType());
            tos.setPrice(to.getPrice());
            tos.setAmount(to.getAmount());
            tos.setRemainAmount(to.getRemainAmount());
            out.add(tos);
        }
        return out;
    }
}

