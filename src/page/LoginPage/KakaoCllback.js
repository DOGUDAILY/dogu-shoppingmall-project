import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      // 백엔드에 code 전달
      api.post("/auth/kakao", { code })
        .then((res) => {
          console.log("카카오 로그인 성공", res.data);
          sessionStorage.setItem("token", res.data.token); // 내 JWT 저장
          navigate("/"); // 홈으로 이동
        })
        .catch((err) => {
          console.error("카카오 로그인 실패", err);
          navigate("/login");
        });
    }
  }, [navigate]);

  return <div>카카오 로그인 처리중...</div>;
};

export default KakaoCallback;
