import React, { useCallback, useState } from "react";
import Swal from "sweetalert2";
import BCcontentUb from "./BCcontentUp";

const BCcontent = ({ bcNum, writer, content, bcDelete, updateCallback }) => {
  const nickname = sessionStorage.getItem("nickName");
  // 수정 버튼을 눌렀을 때 상태 처리
  const [viewUpdate, setViewUpdate] = useState(false);

  // 수정 버튼 처리
  const bcUpdate = useCallback(() => {
    setViewUpdate(true);
  }, [nickname]);

  return (
    <div>
      {viewUpdate ? (
        <BCcontentUb
          bcNum={bcNum}
          content={content}
          writer={writer}
          bcDelete={bcDelete}
          updateCallback={updateCallback}
        />
      ) : (
        <div
          style={{
            height: "75px",
            width: "100%",
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          <div
            style={{
              margin: "5px 0px 20px 20px",
              fontSize: "13px",
              textAlign: "left",
            }}
          >
            {content}
          </div>

          {nickname === writer ? (
            <div
              style={{
                textAlign: "right",
                marginRight: "22px",
              }}
            >
              <button
                className="ct-update-btn"
                style={{
                  padding: "0",
                  width: "31px",
                  border: "none",
                  fontSize: "12px",
                  color: "rgba(111, 111, 111, 0.69)",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => bcUpdate()}
              >
                수정
              </button>
              <button
                className="ct-delete-btn"
                style={{
                  padding: "0",
                  width: "31px",
                  border: "none",
                  fontSize: "12px",
                  color: "rgba(111, 111, 111, 0.69)",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
                onClick={() => bcDelete(bcNum, writer)}
              >
                삭제
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default BCcontent;
