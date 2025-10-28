// 세종 프로그래밍 언어 인터프리터
class 세종언어 {
    constructor() {
        this.변수들 = new Map();
        this.함수들 = new Map();
        this.출력결과 = [];
    }

    // 토큰화 (Tokenization)
    토큰화(코드) {
        // 문장별로 분리 (마침표 기준)
        const 문장들 = 코드.split('.').filter(문장 => 문장.trim().length > 0);
        return 문장들.map(문장 => 문장.trim());
    }

    // 파싱 (Parsing)
    파싱(문장) {
        const 토큰들 = 문장.split(/\s+/);

        // 변수 선언: "변수 이름을 값으로 정하라"
        if (토큰들[0] === '변수' && 문장.includes('정하라')) {
            const 매치 = 문장.match(/변수 (.+?)을 (.+?)로 정하라/);
            if (매치) {
                return {
                    타입: '변수선언',
                    이름: 매치[1],
                    값: 매치[2]
                };
            }
        }

        // 출력: "값을 출력하라"
        if (문장.includes('출력하라')) {
            const 매치 = 문장.match(/(.+?)을 출력하라/);
            if (매치) {
                return {
                    타입: '출력',
                    값: 매치[1]
                };
            }
        }

        // 조건문: "만약 조건이면"
        if (토큰들[0] === '만약') {
            const 매치 = 문장.match(/만약 (.+?)이면/);
            if (매치) {
                return {
                    타입: '조건문시작',
                    조건: 매치[1]
                };
            }
        }

        // 아니면
        if (토큰들[0] === '아니면') {
            return { 타입: '아니면' };
        }

        // 끝
        if (토큰들[0] === '끝') {
            return { 타입: '끝' };
        }

        // 함수 정의: "함수 이름을 매개변수로 정의하라"
        if (토큰들[0] === '함수' && 문장.includes('정의하라')) {
            const 매치 = 문장.match(/함수 (.+?)을 (.+?)로 정의하라/);
            if (매치) {
                return {
                    타입: '함수정의시작',
                    이름: 매치[1],
                    매개변수: 매치[2]
                };
            }
        }

        // 반환: "결과를 값으로 반환하라"
        if (문장.includes('반환하라')) {
            const 매치 = 문장.match(/결과를 (.+?)로 반환하라/);
            if (매치) {
                return {
                    타입: '반환',
                    값: 매치[1]
                };
            }
        }

        // 반복문: "숫자만큼 반복하라"
        if (문장.includes('반복하라')) {
            const 매치 = 문장.match(/(.+?)만큼 반복하라/);
            if (매치) {
                return {
                    타입: '반복문시작',
                    횟수: 매치[1]
                };
            }
        }

        // 함수 호출이나 연산 감지
        if (문장.includes('호출한값') || 문장.includes('더한값') || 문장.includes('뺀값') ||
            문장.includes('곱한값') || 문장.includes('나눈값')) {
            return {
                타입: '표현식',
                내용: 문장
            };
        }

        return { 타입: '알수없음', 내용: 문장 };
    }

    // 값 평가
    값평가(표현식) {
        // 문자열 리터럴
        if (표현식.startsWith('"') && 표현식.endsWith('"')) {
            return 표현식.slice(1, -1);
        }

        // 숫자 리터럴
        if (!isNaN(표현식)) {
            return Number(표현식);
        }

        // 변수 참조
        if (this.변수들.has(표현식)) {
            return this.변수들.get(표현식);
        }

        // 연산 처리
        if (표현식.includes('더한값')) {
            const 매치 = 표현식.match(/(.+?)와 (.+?)를 더한값/);
            if (매치) {
                return this.값평가(매치[1]) + this.값평가(매치[2]);
            }
        }

        if (표현식.includes('뺀값')) {
            const 매치 = 표현식.match(/(.+?)에서 (.+?)를 뺀값/);
            if (매치) {
                return this.값평가(매치[1]) - this.값평가(매치[2]);
            }
        }

        if (표현식.includes('곱한값')) {
            const 매치 = 표현식.match(/(.+?)와 (.+?)를 곱한값/);
            if (매치) {
                return this.값평가(매치[1]) * this.값평가(매치[2]);
            }
        }

        if (표현식.includes('나눈값')) {
            const 매치 = 표현식.match(/(.+?)를 (.+?)로 나눈값/);
            if (매치) {
                return this.값평가(매치[1]) / this.값평가(매치[2]);
            }
        }

        // 함수 호출
        if (표현식.includes('호출한값')) {
            const 매치 = 표현식.match(/(.+?)을 (.+?)로 호출한값/);
            if (매치) {
                const 함수명 = 매치[1];
                const 인수 = this.값평가(매치[2]);
                return this.함수호출(함수명, 인수);
            }
        }

        return 표현식;
    }

    // 조건 평가
    조건평가(조건식) {
        // 비교 연산자들
        if (조건식.includes('보다 크거나같으면')) {
            const 매치 = 조건식.match(/(.+?)가 (.+?)보다 크거나같으면/);
            if (매치) {
                return this.값평가(매치[1]) >= this.값평가(매치[2]);
            }
        }

        if (조건식.includes('보다 크면')) {
            const 매치 = 조건식.match(/(.+?)가 (.+?)보다 크면/);
            if (매치) {
                return this.값평가(매치[1]) > this.값평가(매치[2]);
            }
        }

        if (조건식.includes('보다 작거나같으면')) {
            const 매치 = 조건식.match(/(.+?)가 (.+?)보다 작거나같으면/);
            if (매치) {
                return this.값평가(매치[1]) <= this.값평가(매치[2]);
            }
        }

        if (조건식.includes('보다 작으면')) {
            const 매치 = 조건식.match(/(.+?)가 (.+?)보다 작으면/);
            if (매치) {
                return this.값평가(매치[1]) < this.값평가(매치[2]);
            }
        }

        if (조건식.includes('와 같으면')) {
            const 매치 = 조건식.match(/(.+?)가 (.+?)와 같으면/);
            if (매치) {
                return this.값평가(매치[1]) === this.값평가(매치[2]);
            }
        }

        return false;
    }

    // 함수 호출
    함수호출(함수명, 인수) {
        if (this.함수들.has(함수명)) {
            const 함수정보 = this.함수들.get(함수명);
            const 이전변수들 = new Map(this.변수들);

            // 매개변수 설정
            this.변수들.set(함수정보.매개변수, 인수);

            // 함수 본문 실행
            const 결과 = this.실행(함수정보.본문);

            // 변수 복원
            this.변수들 = 이전변수들;

            return 결과;
        }
        return null;
    }

    // 프로그램 실행
    실행(코드) {
        const 문장들 = this.토큰화(코드);
        const 파싱결과들 = 문장들.map(문장 => this.파싱(문장));

        let 현재함수 = null;
        let 함수본문 = [];
        let 조건스택 = [];
        let 반복스택 = [];
        let 반환값 = null;

        for (let i = 0; i < 파싱결과들.length; i++) {
            const 명령 = 파싱결과들[i];

            if (명령.타입 === '변수선언') {
                const 값 = this.값평가(명령.값);
                this.변수들.set(명령.이름, 값);
            }

            else if (명령.타입 === '출력') {
                const 값 = this.값평가(명령.값);
                this.출력결과.push(값);
                console.log(값);
            }

            else if (명령.타입 === '조건문시작') {
                const 조건결과 = this.조건평가(명령.조건);
                조건스택.push({ 조건: 조건결과, 실행중: 조건결과 });
            }

            else if (명령.타입 === '아니면') {
                if (조건스택.length > 0) {
                    const 현재조건 = 조건스택[조건스택.length - 1];
                    현재조건.실행중 = !현재조건.조건;
                }
            }

            else if (명령.타입 === '끝') {
                if (조건스택.length > 0) {
                    조건스택.pop();
                } else if (반복스택.length > 0) {
                    반복스택.pop();
                } else if (현재함수) {
                    this.함수들.set(현재함수.이름, {
                        매개변수: 현재함수.매개변수,
                        본문: 함수본문.join('.')
                    });
                    현재함수 = null;
                    함수본문 = [];
                }
            }

            else if (명령.타입 === '함수정의시작') {
                현재함수 = { 이름: 명령.이름, 매개변수: 명령.매개변수 };
                함수본문 = [];
            }

            else if (명령.타입 === '반환') {
                반환값 = this.값평가(명령.값);
                return 반환값;
            }

            else if (명령.타입 === '반복문시작') {
                const 횟수 = this.값평가(명령.횟수);
                반복스택.push({ 횟수, 현재: 0, 시작위치: i });
            }

            else if (명령.타입 === '표현식') {
                // 조건문 안에서 실행 여부 확인
                const 실행가능 = 조건스택.length === 0 ||
                    조건스택[조건스택.length - 1].실행중;

                if (실행가능) {
                    if (현재함수) {
                        함수본문.push(문장들[i]);
                    } else {
                        this.값평가(명령.내용);
                    }
                }
            }
        }

        return 반환값;
    }

    // 출력 결과 가져오기
    출력결과가져오기() {
        return this.출력결과;
    }

    // 변수 상태 가져오기
    변수상태가져오기() {
        return Object.fromEntries(this.변수들);
    }
}

// 사용 예제
if (typeof window === 'undefined') {
    // Node.js 환경에서 테스트
    const 인터프리터 = new 세종언어();

    console.log('=== 세종 프로그래밍 언어 테스트 ===\n');

    // 테스트 1: Hello World
    console.log('1. Hello World:');
    인터프리터.실행('"안녕 세상아!"를 출력하라.');

    // 테스트 2: 변수와 연산
    console.log('\n2. 변수와 연산:');
    인터프리터.실행(`
        변수 a를 10으로 정하라.
        변수 b를 20으로 정하라.
        변수 합계를 a와 b를 더한값으로 정하라.
        합계를 출력하라.
    `);

    // 테스트 3: 조건문
    console.log('\n3. 조건문:');
    인터프리터.실행(`
        변수 나이를 25로 정하라.
        만약 나이가 20보다 크거나같으면
            "성인입니다"를 출력하라.
        아니면
            "미성년자입니다"를 출력하라.
        끝.
    `);

    console.log('\n변수 상태:', 인터프리터.변수상태가져오기());
}

// 브라우저에서 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = 세종언어;
} else if (typeof window !== 'undefined') {
    window.세종언어 = 세종언어;
}