import axios from "axios"

const Recruit = function () {
    const KEY='f0Oz28iEhmW2x7xouZpeeLwJik829e9QzNfj1bW3SpgVqoQxf12'
    const sw='개발'
    const dt=''
    const url = `https://oapi.saramin.co.kr/job-search?access-key=${KEY}&keyword=${dt}`

    // fetch("https://oapi.saramin.co.kr/job-search").then((response) =>
    //     console.log(response)
    //     // .then((response) => response.json())
    //     // .then((data) => console.log(data))
    // );

    // const response = fetch(url, {
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });
    // console.log(response);

    // fetch 요청을 처리하기 위해 async/await 사용
    async function fetchData() {
        try {
            const response = await axios({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) { // 정상 응답
                const data = await response.json();
                console.log(data);
            } else { // 에러 발생
                const errorData = await response.text();
                console.error(`에러 발생 - 상태 코드: ${response.status}, 에러 메시지: ${errorData}`);
            }
        } catch (error) {
            console.error("Fetch 오류:", error);
        }
    }

    fetchData(); // async 함수를 호출하여 fetch 요청을 시작
}

export default Recruit