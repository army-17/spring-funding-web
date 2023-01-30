import "./KaKaoButton.scss";

const CLIENT_ID = "3325b1fa29c94621b861b2793200c360";
const REDIRECT_URI =  "http://localhost:3000/oauth/callback/kakao";

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

const ocKakao = () => {
    window.open(KAKAO_AUTH_URL, "_self");
}
const KakaoButton = () => {
    return (
    <div className="test">
            <div className='kakao_btn' onClick={ocKakao}></div>
    </div>
    );
};

export default KakaoButton;
