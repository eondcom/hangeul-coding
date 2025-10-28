// 한 글자 콜론(:) 한글 프로그래밍 언어 인터프리터

class 한글자언어 {
    constructor() {
        this.변수들 = new Map();
        this.함수들 = new Map();
        this.스택 = [];
        this.출력결과 = [];
        this.마지막연산결과 = null;

        // 순우리말 숫자 매핑
        this.순우리말숫자 = {
            '하나': 1, '둘': 2, '셋': 3, '넷': 4, '다섯': 5,
            '여섯': 6, '일곱': 7, '여덟': 8, '아홉': 9,
            '열': 10, '스무': 20, '서른': 30, '마흔': 40, '쉰': 50
        };
    }

    // 값 변환 (문자열 → 실제 값)
    값변환(값) {
        if (typeof 값 === 'number') return 값;

        // 숫자 체크
        if (!isNaN(값)) return Number(값);

        // 순우리말 숫자 체크
        if (this.순우리말숫자[값]) return this.순우리말숫자[값];

        // 변수 참조
        if (this.변수들.has(값)) return this.변수들.get(값);

        // 문자열 그대로
        return 값;
    }

    // 출력 함수
    출력(내용) {
        console.log(내용);
        this.출력결과.push(내용);
    }

    // 명령 실행
    명령실행(명령, 인수들) {
        switch (명령) {
            case '담': // 변수 저장
                if (인수들.length >= 2) {
                    const 이름 = 인수들[0];
                    let 값 = 인수들.slice(1).join(' ');

                    // 연산 결과나 특별한 값 처리
                    if (값 === '더결과' && this.마지막연산결과 !== null) {
                        값 = this.마지막연산결과;
                    } else if (값 === '빼결과' && this.마지막연산결과 !== null) {
                        값 = this.마지막연산결과;
                    } else if (값 === '곱결과' && this.마지막연산결과 !== null) {
                        값 = this.마지막연산결과;
                    } else if (값 === '나결과' && this.마지막연산결과 !== null) {
                        값 = this.마지막연산결과;
                    } else {
                        값 = this.값변환(값);
                    }

                    this.변수들.set(이름, 값);
                }
                break;

            case '말': // 출력
                const 메시지 = 인수들.join(' ');
                this.출력(메시지);
                break;

            case '보': // 변수 값 출력
                if (인수들.length > 0) {
                    const 변수명 = 인수들[0];
                    const 값 = this.변수들.get(변수명);
                    if (값 !== undefined) {
                        this.출력(값);
                    }
                }
                break;

            case '더': // 덧셈
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    this.마지막연산결과 = a + b;
                }
                break;

            case '빼': // 뺄셈
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    this.마지막연산결과 = a - b;
                }
                break;

            case '곱': // 곱셈
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    this.마지막연산결과 = a * b;
                }
                break;

            case '나': // 나눗셈
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    if (b !== 0) {
                        this.마지막연산결과 = Math.floor(a / b);
                    }
                }
                break;

            case '같': // 같은지 비교
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    this.마지막연산결과 = a === b;
                }
                break;

            case '큰': // 큰지 비교
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    this.마지막연산결과 = a > b;
                }
                break;

            case '작': // 작은지 비교
                if (인수들.length >= 2) {
                    const a = this.값변환(인수들[0]);
                    const b = this.값변환(인수들[1]);
                    this.마지막연산결과 = a < b;
                }
                break;

            case '들': // 입력 (시뮬레이션)
                if (인수들.length > 0) {
                    const 변수명 = 인수들[0];
                    // 실제 환경에서는 readline 등을 사용
                    const 입력값 = `사용자입력_${변수명}`;
                    this.변수들.set(변수명, 입력값);
                    this.출력(`[입력 대기: ${변수명}]`);
                }
                break;

            case '슬': // 슬립/대기
                if (인수들.length > 0) {
                    const 초 = this.값변환(인수들[0]);
                    this.출력(`${초}초 대기 중...`);
                }
                break;

            default:
                // 알 수 없는 명령
                break;
        }
    }

    // 코드 실행
    실행(코드) {
        this.출력결과 = [];
        this.변수들.clear();
        this.마지막연산결과 = null;

        const 줄들 = 코드.split('\n')
            .map(줄 => 줄.trim())
            .filter(줄 => 줄.length > 0 && !줄.startsWith('//'));

        let 조건스택 = [];
        let 반복스택 = [];
        let 함수정의중 = null;

        for (let i = 0; i < 줄들.length; i++) {
            const 줄 = 줄들[i];

            // 콜론(:)으로 명령과 인수 분리
            const 콜론위치 = 줄.indexOf(':');
            if (콜론위치 === -1) continue;

            const 명령 = 줄.substring(0, 콜론위치).trim();
            const 인수부분 = 줄.substring(콜론위치 + 1).trim();
            const 인수들 = 인수부분.split(/\s+/).filter(인수 => 인수.length > 0);

            try {
                // 조건문 처리
                if (명령 === '만') { // 만약
                    if (인수들.length > 0) {
                        const 조건식 = 인수들[0];
                        let 조건결과 = false;

                        // 간단한 조건 파싱
                        if (조건식.includes('>')) {
                            const [좌측, 우측] = 조건식.split('>');
                            조건결과 = this.값변환(좌측) > this.값변환(우측);
                        } else if (조건식.includes('<')) {
                            const [좌측, 우측] = 조건식.split('<');
                            조건결과 = this.값변환(좌측) < this.값변환(우측);
                        } else if (조건식.includes('=')) {
                            const [좌측, 우측] = 조건식.split('=');
                            조건결과 = this.값변환(좌측) === this.값변환(우측);
                        }

                        조건스택.push(조건결과);
                    }
                    continue;
                }

                if (명령 === '아') { // 아니면
                    if (조건스택.length > 0) {
                        조건스택[조건스택.length - 1] = !조건스택[조건스택.length - 1];
                    }
                    continue;
                }

                if (명령 === '끝') { // 끝
                    if (조건스택.length > 0) {
                        조건스택.pop();
                    } else if (반복스택.length > 0) {
                        const 반복정보 = 반복스택[반복스택.length - 1];
                        반복정보.현재++;
                        if (반복정보.현재 < 반복정보.횟수) {
                            i = 반복정보.시작위치;
                        } else {
                            반복스택.pop();
                        }
                    }
                    continue;
                }

                // 반복문 처리
                if (명령 === '돌') { // 반복
                    if (인수들.length > 0) {
                        const 횟수 = this.값변환(인수들[0]);
                        반복스택.push({
                            횟수: 횟수,
                            현재: 0,
                            시작위치: i
                        });
                    }
                    continue;
                }

                // 실행 조건 확인
                const 실행가능 = 조건스택.length === 0 || 조건스택[조건스택.length - 1];

                if (실행가능) {
                    this.명령실행(명령, 인수들);
                }

            } catch (오류) {
                this.출력(`오류: ${오류.message}`);
            }
        }

        return this.출력결과;
    }

    // 변수 상태 반환
    변수상태() {
        return Object.fromEntries(this.변수들);
    }

    // 초기화
    초기화() {
        this.변수들.clear();
        this.함수들.clear();
        this.스택 = [];
        this.출력결과 = [];
        this.마지막연산결과 = null;
    }
}

// 사용 예제
if (typeof window === 'undefined') {
    // Node.js 환경에서 테스트
    const 인터프리터 = new 한글자언어();

    console.log('=== 한 글자 한글 프로그래밍 언어 테스트 ===\n');

    // 테스트 1: Hello World
    console.log('1. Hello World:');
    인터프리터.실행('말: 안녕 세상아!');

    // 테스트 2: 변수와 연산
    console.log('\n2. 변수와 연산:');
    인터프리터.실행(`
        담: a 열
        담: b 스무
        더: a b
        담: 합 더결과
        말: 계산 결과는
        보: 합
        말: 입니다
    `);

    // 테스트 3: 조건문
    console.log('\n3. 조건문:');
    인터프리터.실행(`
        담: 나이 25
        만: 나이>20
            말: 성인입니다
        아:
            말: 미성년자입니다
        끝:
    `);

    // 테스트 4: 반복문
    console.log('\n4. 반복문:');
    인터프리터.실행(`
        말: 훈민정음 창제 시작!
        담: 횟수 다섯
        돌: 횟수
            말: 글자 하나 완성!
            빼: 횟수 하나
            담: 횟수 빼결과
        끝:
        말: 창제 완료!
    `);

    console.log('\n변수 상태:', 인터프리터.변수상태());
}

// 브라우저에서도 사용 가능하도록
if (typeof module !== 'undefined' && module.exports) {
    module.exports = 한글자언어;
} else if (typeof window !== 'undefined') {
    window.한글자언어 = 한글자언어;
}