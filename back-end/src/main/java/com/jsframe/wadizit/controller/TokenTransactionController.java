package com.jsframe.wadizit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jsframe.wadizit.dto.*;
import com.jsframe.wadizit.entity.*;
import com.jsframe.wadizit.repository.*;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.util.*;

@Log
@RestController
public class TokenTransactionController {
    @Autowired
    private MemberRepository memberRepo;
    @Autowired
    private TokenRepository tokenRepo;
    @Autowired
    private FundingRepository fundingRepo;
    @Autowired
    private TokenOrderRepository tokenOrderRepo;
    @Autowired
    private TokenPossessionRepository tokenPossessionRepo;
    @Autowired
    private TokenTransactionRepository tokenTransactionRepo;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private static final int ORDER_TYPE_BUY = 1;
    private static final int ORDER_TYPE_SELL = 2;

    private static final int ORDER_STATUS_RD = 1;
    private static final int ORDER_STATUS_TX = 2;
    private static final int ORDER_STATUS_CC = 3;

    private ObjectMapper objectMapper = new ObjectMapper();
    private Map<Long, Token> tokenMap = new HashMap<>();
    private Map<Long, List<TokenOrder>> tokenOrderMap = new HashMap<>();
    private Map<Long, List<TokenTransaction>> tokenTransactionMap = new HashMap<>();

    private TokenInitRes retInitError(int code, String msg) {
        TokenInitRes ret = new TokenInitRes();
        ret.setRetCode(code);
        ret.setErrorMsg(msg);
        return ret;
    }

    private TokenOrderRes retOrderError(int code, String msg) {
        TokenOrderRes ret = new TokenOrderRes();
        ret.setRetCode(code);
        ret.setErrorMsg(msg);
        return ret;
    }

    @PostConstruct
    private void init() {
        List<Token> tokenList = tokenRepo.findAll();
        for (int i=0; i<tokenList.size(); i++) {
//            Token token = tokenList.get(i);
//            tokenMap.put(token.getTokenNum(), token);
//
//            // 토큰 주문 리스트 세팅
//            List<TokenOrder> tokenOrderList = tokenOrderRepo.findAllByTokenNumOrderByCreateDate(token);
//            if (tokenOrderList == null) tokenOrderList = new ArrayList<>();
//            tokenOrderMap.put(token.getTokenNum(), tokenOrderList);
//
//            // 토큰 체결 리스트 세팅
//            List<TokenTransaction> tokenTransactionList = tokenTransactionRepo.findAllByTokenNumOrderByCreateDate(token);
//            if (tokenTransactionList == null) tokenTransactionList = new ArrayList<>();
//            tokenTransactionMap.put(token.getTokenNum(), tokenTransactionList);
        }
    }

    @MessageMapping("/init/{memberNum}")
    public void init(@DestinationVariable long memberNum, TokenInitReq tir, SimpMessageHeaderAccessor mha) {
        String destURI = "/queue/init-" + memberNum;
        HttpSession session = (HttpSession) mha.getSessionAttributes().get("httpSession");
        Member member = (Member) session.getAttribute("mem");
        if (member == null) {
            simpMessagingTemplate.convertAndSend(destURI, retInitError(403, "Login required"));
            return;
        }
        // 최신 멤버 객체 얻기
        member = memberRepo.findById(member.getMemberNum()).get();

        // 초기화 정보를 반환할 객체 생성
        TokenInitRes initRes = new TokenInitRes();

        // 토큰 정보 얻기
        Optional<Token> tokenOpt = tokenRepo.findById(tir.getTokenNum());
        if (tokenOpt.isPresent() == false) {
            simpMessagingTemplate.convertAndSend(destURI, retInitError(500, "Invalid token number"));
            return;
        }
        Token token = tokenOpt.get();

        Funding funding = fundingRepo.findById(token.getTokenNum()).get();
        initRes.setEndDate(funding.getEndDate());
        initRes.setFundingStatus(funding.getStatus());

        // 대기중인 주문 리스트 얻기
        List<TokenOrder> tokenOrderList =
                tokenOrderRepo.findAllByStatusEqualsAndTokenNumOrderByCreateDate(ORDER_STATUS_RD, token);
        // 체결 리스트 얻기
        // List<TokenTransaction> tokenTransactionList = tokenTransactionRepo.findAllByTokenNumOrderByCreateDate(token);

        // 토큰, 주문, 체결 정보 세팅
        initRes.setToken(new TokenSimple(token));
        initRes.setTokenOrderList(TokenOrderSimple.convertSimple(tokenOrderList));
        // initRes.setTokenTransactionList(TokenTransactionSimple.convertSimple(tokenTransactionList));

        if (member != null) {
            initRes.setMember(member);
            // 해당 회원의 주문 목록 얻기
            List<TokenOrder> myTokenOrderList = tokenOrderRepo.findAllByStatusEqualsAndMemberNum(ORDER_STATUS_RD, member);
            initRes.setMyOrderList(TokenOrderSimple.convertSimple(myTokenOrderList));
            // 토큰 소유 정보 얻기
            MemberTokenID mtID = new MemberTokenID();
            mtID.setTokenNum(token.getTokenNum());
            mtID.setMemberNum(member.getMemberNum());
            // 아직 해당 토큰을 소유하지 않은 경우
            if (tokenPossessionRepo.findById(mtID).isPresent() == false) {
                TokenPossession tp = new TokenPossession();
                tp.setMemberNum(member.getMemberNum());
                tp.setTokenNum(token.getTokenNum());
                tp.setAmount(0);
                tokenPossessionRepo.save(tp);
                initRes.setAvailableToken(0);
            }
            // 해당 토큰을 소유한 경우
            else {
                initRes.setAvailableToken(tokenPossessionRepo.findById(mtID).get().getAmount());
            }
        }
        simpMessagingTemplate.convertAndSend(destURI, initRes);
    }

    @MessageMapping("/order/{tokenNum}")
    @SendTo("/topic/order/{tokenNum}")
    public TokenOrderRes order(@DestinationVariable long tokenNum,
                             TokenOrder order, SimpMessageHeaderAccessor mha){
        HttpSession session = (HttpSession) mha.getSessionAttributes().get("httpSession");
        TokenOrderRes tor = new TokenOrderRes();
        Member orderer = (Member)session.getAttribute("mem");
        if (orderer == null) {
            return retOrderError(403, "Login required");
        }
        orderer = memberRepo.findById(orderer.getMemberNum()).get();
        // 토큰 정보 얻기
        if (tokenRepo.findById(tokenNum).isPresent() == false) {
            return retOrderError(500, "Invalid token number");
        }
        Token token = tokenRepo.findById(tokenNum).get();
        // 유효한 주문인지 체크
        if (order.getPrice() < 1 || order.getAmount() < 1 ||
                // 액면가 체크
                order.getPrice() % token.getParValue() != 0) {
            return retOrderError(500, "Invalid price or amount");
        }
        // 주문 타입 체크
        if (order.getType() != ORDER_TYPE_BUY && order.getType() != ORDER_TYPE_SELL) {
            return retOrderError(500, "Invalid order type");
        }

        // 소유 토큰 정보 얻기
        TokenPossession tp = tokenPossessionRepo.findByMemberNumAndTokenNum(
                orderer.getMemberNum(), token.getTokenNum());
        // 주문 가능 체크
        if (order.getType() == ORDER_TYPE_BUY && order.getPrice() * order.getAmount() > orderer.getPoint()) {
            return retOrderError(500, "Not enough point");
        } else if (order.getType() == ORDER_TYPE_SELL && tp.getAmount() < order.getAmount()) {
            return retOrderError(500, "Not enough token");
        }

        // 주문 요청 데이터 세팅
        order.setMemberNum(orderer);
        order.setTokenNum(token);
        order.setStatus(ORDER_STATUS_RD);
        order.setRemainAmount(order.getAmount());
        order = tokenOrderRepo.save(order);

        // 주문 타입에 매칭되는(매수 -> 매도, 매도 -> 매수) 대기 주문 리스트 얻기
        List<TokenOrder> orderPairList = order.getType() == ORDER_TYPE_BUY
                ? tokenOrderRepo.findAllByTypeEqualsAndStatusEqualsAndPriceLessThanEqualOrderByPrice(
                        ORDER_TYPE_SELL, ORDER_STATUS_RD, order.getPrice())
                : tokenOrderRepo.findAllByTypeEqualsAndStatusEqualsAndPriceGreaterThanEqualOrderByPriceDesc(
                ORDER_TYPE_BUY, ORDER_STATUS_RD, order.getPrice());

        // 체결 처리
        for (int i=0; i<orderPairList.size(); i++) {
            TokenOrder pairOrder = orderPairList.get(i);
            long transAmount;
            if (order.getRemainAmount() <= pairOrder.getRemainAmount()) {
                transAmount = order.getRemainAmount();
                pairOrder.setRemainAmount(pairOrder.getRemainAmount() - order.getRemainAmount());
                order.setRemainAmount(0);
                order.setStatus(ORDER_STATUS_TX);
            }
            else {
                transAmount = pairOrder.getRemainAmount();
                order.setRemainAmount(order.getRemainAmount() - pairOrder.getRemainAmount());
                pairOrder.setRemainAmount(0);
                pairOrder.setStatus(ORDER_STATUS_TX);
            }
            TokenOrder buyOrder = pairOrder.getType() == ORDER_TYPE_BUY ? pairOrder : order;
            TokenOrder sellOrder = pairOrder.getType() == ORDER_TYPE_SELL ? pairOrder : order;

            // 매도자의 포인트 증가 및 보유 토큰 차감
            Member seller = sellOrder.getMemberNum();
            seller.setPoint(seller.getPoint() + (int)(pairOrder.getPrice() * transAmount));
            memberRepo.save(seller);
            TokenPossession stp = tokenPossessionRepo.findByMemberNumAndTokenNum(
                    seller.getMemberNum(), token.getTokenNum());
            stp.setAmount(stp.getAmount() - transAmount);
            tokenPossessionRepo.save(stp);
            TokenTransactionSimple txs = new TokenTransactionSimple();
            txs.setSellOrder(new TokenOrderSimple(sellOrder));
            txs.setSellerTokenAmount(stp.getAmount());
            txs.setSellerMemberNum(seller.getMemberNum());
            txs.setSellerPoint(seller.getPoint());

            // 메수자의 포인트 차감 및 보유 토큰 증가
            Member buyer = buyOrder.getMemberNum();
            buyer.setPoint(buyer.getPoint() - (int)(pairOrder.getPrice() * transAmount));
            memberRepo.save(buyer);
            TokenPossession btp = tokenPossessionRepo.findByMemberNumAndTokenNum(
                    buyer.getMemberNum(), token.getTokenNum());
            btp.setAmount(btp.getAmount() + transAmount);
            tokenPossessionRepo.save(btp);
            txs.setBuyOrder(new TokenOrderSimple(buyOrder));
            txs.setBuyerTokenAmount(btp.getAmount());
            txs.setBuyerMemberNum(buyer.getMemberNum());
            txs.setBuyerPoint(buyer.getPoint());

            // 주문 정보 업데이트
            tokenOrderRepo.save(order);
            tokenOrderRepo.save(pairOrder);

            // 체결 처리
            TokenTransaction tt = new TokenTransaction();
            tt.setBuyTokenOrderNum(buyOrder);
            tt.setSellTokenOrderNum(sellOrder);
            tt.setTokenNum(token);
            tt.setPrice(transAmount);
            tokenTransactionRepo.save(tt);

            tor.addTransaction(txs);

            // 모든 수량에 대한 주문이 처리된 경우
            if (order.getRemainAmount() == 0) break;
        }
        // 체결이 하나도 되지 않은 경우
        if (order.getRemainAmount() == order.getAmount()) {
            TokenTransactionSimple tt = new TokenTransactionSimple();
            // 매수자의 포인트 차감
            if (order.getType() == ORDER_TYPE_BUY) {
                orderer.setPoint(orderer.getPoint() - (int)(order.getPrice() * order.getAmount()));
                memberRepo.save(orderer);
                tt.setBuyOrder(new TokenOrderSimple(order));
                tt.setBuyerTokenAmount(tp.getAmount());
                tt.setBuyerPoint(orderer.getPoint());
                tt.setBuyerMemberNum(orderer.getMemberNum());
            }
            // 매도자의 보유 토큰 차감
            else if (order.getType() == ORDER_TYPE_SELL) {
                tp.setAmount(tp.getAmount() - order.getAmount());
                tokenPossessionRepo.save(tp);
                tt.setSellOrder(new TokenOrderSimple(order));
                tt.setSellerMemberNum(orderer.getMemberNum());
                tt.setSellerPoint(orderer.getPoint());
                tt.setSellerTokenAmount(tp.getAmount());
            }
            tor.addTransaction(tt);
        }
        return tor;
    }

    @MessageMapping("/cancel/{tokenNum}")
    @SendTo("/topic/cancel/{tokenNum}")
    public TokenOrderRes cancel(@DestinationVariable long tokenNum,
                                TokenOrder cancelOrder, SimpMessageHeaderAccessor mha){
        HttpSession session = (HttpSession) mha.getSessionAttributes().get("httpSession");
        Member canceler = (Member)session.getAttribute("mem");
        if (canceler == null) {
            return retOrderError(403, "Login required");
        }
        canceler = memberRepo.findById(canceler.getMemberNum()).get();
        // 토큰 정보 얻기
        Optional<Token> tokenOpt = tokenRepo.findById(tokenNum);
        if (tokenOpt.isPresent() == false) {
            return retOrderError(500, "Invalid token number");
        }
        Token token = tokenOpt.get();
        // 주문 정보 얻기
        Optional<TokenOrder> orderOpt = tokenOrderRepo.findById(cancelOrder.getTokenOrderNum());
        if (orderOpt.isPresent() == false) {
            return retOrderError(500, "Invalid order number");
        }
        TokenOrder order = orderOpt.get();

        // 로그인 회원과 주문자가 일치하는지 체크
        if (canceler.getMemberNum() != order.getMemberNum().getMemberNum()) {
            return retOrderError(500, "Orderer and login account do not match");
        }
        // 보유 토큰 정보 얻기
        TokenPossession tp = tokenPossessionRepo.findByMemberNumAndTokenNum(
                canceler.getMemberNum(), token.getTokenNum());
        // 이전 주문 타입에 따른 주문자의 자산 반환
        switch ((int)order.getType()) {
            // 매수 주문 취소의 경우: 주문 금액 반환
            case ORDER_TYPE_BUY:
                canceler.setPoint((int)(canceler.getPoint() + order.getPrice() * order.getRemainAmount()));
                memberRepo.save(canceler);
                break;
            // 매도 주문 취소의 경우: 주문 토큰 반환
            case ORDER_TYPE_SELL:
                tp.setAmount(tp.getAmount() + order.getRemainAmount());
                tokenPossessionRepo.save(tp);
                break;
            default:
                return retOrderError(500, "Invalid previous order number");
        }
        // 주문 상태 변경
        order.setStatus(ORDER_STATUS_CC);
        tokenOrderRepo.save(order);

        TokenOrderRes tor = new TokenOrderRes();
        TokenTransactionSimple tori = new TokenTransactionSimple();
        tori.setBuyerMemberNum(canceler.getMemberNum());
        tori.setCancelOrder(new TokenOrderSimple(order));
        tori.setBuyerPoint(canceler.getPoint());
        tori.setBuyerTokenAmount(tp.getAmount());
        tor.addTransaction(tori);

        return tor;
    }
}