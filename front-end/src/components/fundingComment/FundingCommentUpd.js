import React, { useCallback, useState } from "react";

const FundingCommentUpd = (props) => {
  const [content, setContent] = useState(props.content);

  const onChange = useCallback(
    (e) => {
      setContent(e.target.value);
    },
    [content]
  );

  //펀딩 댓글 수정 기능
  const getUpdateCom = useCallback(() => {
    // console.log(content);

    props.modify(content, () => {
      setContent("");
    });
  }, [content]);

  return (
    <div>
      <div className="bComContentArea">
        <textarea 
          type="text"
          className="bComContent"
          name="content"
          value={content}
          onChange={onChange}
          style={{ resize: "none" ,margin : "20px 0px 10px 30px", padding:"10px", fontSize:"1.1rem", width:"500px", height:"50px"}}
        ></textarea>
      </div>
      <div className="fundComBtnArea" style={{marginTop:"-10px", float:"right" }}>
        <button onClick={props.cancel}  style={{all:"unset", cursor:"pointer",marginRight:"10px", color: "rgba(111, 111, 111, 0.69)"}}>취소</button>
        <button onClick={getUpdateCom}  style={{all:"unset", cursor:"pointer",marginRight:"10px", color: "rgba(111, 111, 111, 0.69)"}}>확인</button>
      </div>
    </div>
  );
};

export default FundingCommentUpd;
