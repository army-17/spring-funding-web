import moment from "moment/moment";
import { useCallback, useState } from "react";
//import userIcon from "../images/userIcon.png";
import { Comment } from "semantic-ui-react";
import FundingCommentUpd from "./FundingCommentUpd";

const FundingCommentDetail = (props) => {
  const dateFormat = () => moment(props.date).format("YYYY-MM-DD HH:mm:ss");
  const nickname = sessionStorage.getItem("nickName");
  const [modView, setModView] = useState(false);

  const modifyComment = useCallback(
    (content, callback) => {
      props.modifyComment(props.fundingComNum, content);
      setModView(!modView);
    },
    [props, modView]
  );

  const cancelMod = useCallback(() => {
    setModView(!modView);
  }, [modView]);

  return (
    <div className="fundComDetail">
      <Comment>  
        <Comment.Content>         
          <Comment.Author
            as="b"
            style={{ fontSize: "1.1em", marginRight: "5px" , color:"#00b2b2"}}
          >
            {props.writer}
          </Comment.Author>
          <Comment.Metadata>
            <div style={{fontSize:"11px", fontWeight:600}}>{dateFormat(props.date)}</div>
          </Comment.Metadata>

          <div className="viewChange">
            {modView === false ? (
              <div>
                <Comment.Text
                  style={{ margin : "30px 0px 10px 30px", fontSize:"1.1rem" }}
                >
                  {props.content}
                </Comment.Text>
                {!(nickname === props.writer) ? (
                  <div style={{ marginBottom: "20px" }}></div>
                ) : (
                  <div
                    className="fundComBtnArea"
                    style={{marginTop:"10px", float:"right" }}
                  >
                    <button type="button" className="fundComUpd"
                      onClick={() => {
                        setModView(!modView);
                        }}
                        style={{all:"unset", cursor:"pointer",marginRight:"10px", color: "rgba(111, 111, 111, 0.69)"}}
                    >
                      수정
                    </button>
                    <button type="button" className="fundComDel"
                        onClick={() => props.deleteComment(props.fundingComNum)}
                        style={{ all: "unset", cursor: "pointer", marginRight: "10px", color: "rgba(111, 111, 111, 0.69)" }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <FundingCommentUpd
                fundingNum={props.fundingComNum}
                content={props.content}
                modify={modifyComment}
                cancel={cancelMod}
              ></FundingCommentUpd>
            )}
            </div>
            </Comment.Content>
      </Comment>
    </div>
  );
};

export default FundingCommentDetail;
