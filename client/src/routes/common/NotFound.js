import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = function () {
    return (
        <div className="flex justify-center items-center w-full h-screen overflow-hidden">
            <div className="flex w-3/4 h-3/4 p-5 border">
                <div className="w-1/2 overflow-hidden">
                    <img src={`${process.env.PUBLIC_URL}/img/not_found.gif`} />
                </div>
                <div className="flex flex-col w-1/2">
                    <div className="flex justify-center items-center gap-3 border-b p-3">
                        <div className="w-20">
                            <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt='청년취업사관학교' />
                        </div>
                        <h1 className="font-semibold text-xl">SeSAC Talk</h1>
                    </div>
                    <div className="flex flex-col flex-grow p-3">
                        <p className="mt-2 font-medium text-xl text-center">요청하신 페이지를 찾을 수 없습니다.</p>
                        <p className="mt-5 flex-grow leading-7">
                            방문하시려는 페이지의 주소가 잘못 입력되었거나,
                            <br />
                            페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
                            <br />
                            입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
                            <br />
                            관련 문의사항은 청년취업사관학교 고객센터에 알려주시면 친절하게 안내해 드리겠습니다.
                            <br />
                            감사합니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound;