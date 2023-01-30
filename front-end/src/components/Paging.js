import React, { useCallback } from "react";
import "./Paging.scss";
import classNames from "classnames";

const Paging = ({ page, getList, pageCntNum }) => {
  const { totalPage, pageNum } = page;
  const pageCnt = pageCntNum; // 보여줄 페이지 범위

  let curGroup = Math.floor(
    // 현재 페이지
    pageNum % pageCnt > 0 ? pageNum / pageCnt + 1 : pageNum / pageCnt
  );

  let start = curGroup * pageCnt - (pageCnt - 1);
  let end = curGroup * pageCnt >= totalPage ? totalPage : curGroup * pageCnt;
  let makePage = totalPage > end ? pageCnt : totalPage - start + 1;

  // 페이지 번호 생성
  const pageList = new Array(makePage).fill().map((_, i) => {
    if (i + start === pageNum) {
      return (
        <div className={classNames("Number", "cur")} key={i + start}>
          {i + start}
        </div>
      );
    } else {
      return (
        <div
          className="Number"
          key={i + start}
          onClick={() => onClick(i + start)}
        >
          {i + start}
        </div>
      );
    }
  });

  //'이전' 버튼 생성
  if (start !== 1) {
    pageList.unshift(
      <div
        className="Number"
        key={start - 1}
        onClick={() => onClick(start - 1)}
      >
        &lt;
      </div>
    );
  }

  //'다음' 버튼 생성
  if (end !== totalPage) {
    pageList.push(
      <div className="Number" key={end + 1} onClick={() => onClick(end + 1)}>
        &gt;
      </div>
    );
  }
  const onClick = useCallback((index) => {
    getList(index);
  }, []);

  return <div className="Paging">{pageList}</div>;
};

export default Paging;
