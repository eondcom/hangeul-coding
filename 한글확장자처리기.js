#!/usr/bin/env node

// 한글 확장자 처리기 - 세종대왕의 파일 시스템!

const fs = require('fs');
const path = require('path');

class 한글확장자처리기 {
    constructor() {
        // 지원하는 한글 확장자들
        this.지원확장자 = {
            '한글': { 타입: '세종언어', 설명: '세종 프로그래밍 언어' },
            '세종': { 타입: '세종언어', 설명: '세종대왕 전용 스크립트' },
            '조선': { 타입: '세종언어', 설명: '조선왕조 계산 스크립트' },
            '창제': { 타입: '세종언어', 설명: '훈민정음 창제 스크립트' },
            '훈민정음': { 타입: '문서', 설명: '훈민정음 문서' },
            '백성': { 타입: '데이터', 설명: '백성 데이터 파일' },
            '궁궐': { 타입: '설정', 설명: '궁궐 설정 파일' }
        };

        // 세종 언어 인터프리터 (간소화 버전)
        this.세종인터프리터 = new 세종언어인터프리터();
    }

    // 한글 확장자 인식
    확장자확인(파일경로) {
        const 확장자 = path.extname(파일경로).slice(1); // 점(.) 제거

        if (this.지원확장자[확장자]) {
            return {
                인식됨: true,
                확장자: 확장자,
                타입: this.지원확장자[확장자].타입,
                설명: this.지원확장자[확장자].설명
            };
        }

        return { 인식됨: false, 확장자: 확장자 };
    }

    // 파일 실행
    async 파일실행(파일경로) {
        try {
            const 확장자정보 = this.확장자확인(파일경로);

            if (!확장자정보.인식됨) {
                throw new Error(`지원하지 않는 확장자입니다: .${확장자정보.확장자}`);
            }

            console.log(`📁 파일: ${path.basename(파일경로)}`);
            console.log(`🏷️  확장자: .${확장자정보.확장자} (${확장자정보.설명})`);
            console.log(`📋 타입: ${확장자정보.타입}`);
            console.log('=' .repeat(50));

            const 파일내용 = fs.readFileSync(파일경로, 'utf8');

            switch (확장자정보.타입) {
                case '세종언어':
                    return await this.세종언어실행(파일내용, 파일경로);

                case '문서':
                    return this.문서출력(파일내용);

                case '데이터':
                    return this.데이터처리(파일내용);

                case '설정':
                    return this.설정로드(파일내용);

                default:
                    throw new Error(`알 수 없는 파일 타입: ${확장자정보.타입}`);
            }

        } catch (오류) {
            console.error(`❌ 오류 발생: ${오류.message}`);
            return false;
        }
    }

    // 세종 언어 실행
    async 세종언어실행(코드, 파일경로) {
        console.log(`🚀 세종 언어 실행 시작...`);
        console.log();

        try {
            const 결과 = this.세종인터프리터.실행(코드);

            console.log();
            console.log('✅ 실행 완료!');

            // 변수 상태 출력
            const 변수상태 = this.세종인터프리터.변수상태();
            if (Object.keys(변수상태).length > 0) {
                console.log();
                console.log('📊 변수 상태:');
                for (const [이름, 값] of Object.entries(변수상태)) {
                    console.log(`   ${이름}: ${값}`);
                }
            }

            return true;
        } catch (오류) {
            console.error(`❌ 실행 오류: ${오류.message}`);
            return false;
        }
    }

    // 문서 출력
    문서출력(내용) {
        console.log('📜 문서 내용:');
        console.log(내용);
        return true;
    }

    // 디렉토리 스캔
    디렉토리스캔(디렉토리경로 = '.') {
        const 파일들 = fs.readdirSync(디렉토리경로);
        const 한글파일들 = [];

        console.log(`📂 "${디렉토리경로}" 디렉토리의 한글 확장자 파일들:`);
        console.log('=' .repeat(60));

        파일들.forEach(파일명 => {
            const 파일경로 = path.join(디렉토리경로, 파일명);
            const 통계 = fs.statSync(파일경로);

            if (통계.isFile()) {
                const 확장자정보 = this.확장자확인(파일명);

                if (확장자정보.인식됨) {
                    한글파일들.push({
                        파일명: 파일명,
                        경로: 파일경로,
                        확장자: 확장자정보.확장자,
                        타입: 확장자정보.타입,
                        설명: 확장자정보.설명,
                        크기: 통계.size
                    });
                }
            }
        });

        if (한글파일들.length === 0) {
            console.log('한글 확장자 파일이 없습니다.');
        } else {
            한글파일들.forEach((파일, 인덱스) => {
                console.log(`${인덱스 + 1}. ${파일.파일명}`);
                console.log(`   📁 확장자: .${파일.확장자}`);
                console.log(`   📋 타입: ${파일.타입}`);
                console.log(`   📄 설명: ${파일.설명}`);
                console.log(`   📏 크기: ${파일.크기} bytes`);
                console.log();
            });
        }

        return 한글파일들;
    }

    // 모든 한글 파일 실행
    async 모든파일실행(디렉토리경로 = '.') {
        const 한글파일들 = this.디렉토리스캔(디렉토리경로);

        console.log('🚀 모든 한글 파일 실행을 시작합니다...');
        console.log('=' .repeat(60));

        for (const 파일 of 한글파일들) {
            if (파일.타입 === '세종언어') {
                console.log(`\n📂 실행 중: ${파일.파일명}`);
                console.log('-' .repeat(40));
                await this.파일실행(파일.경로);
                console.log();
            }
        }
    }
}

// 간단한 세종 언어 인터프리터
class 세종언어인터프리터 {
    constructor() {
        this.변수들 = new Map();
    }

    값평가(표현식) {
        // 문자열 리터럴
        if (표현식.match(/^".*"$/)) {
            return 표현식.slice(1, -1);
        }

        // 숫자 리터럴
        if (!isNaN(표현식) && 표현식.trim() !== '') {
            return Number(표현식);
        }

        // 변수 참조
        if (this.변수들.has(표현식)) {
            return this.변수들.get(표현식);
        }

        // 연산 처리
        const 덧셈 = 표현식.match(/(.+?)와 (.+?)를 더한값/);
        if (덧셈) {
            return this.값평가(덧셈[1]) + this.값평가(덧셈[2]);
        }

        const 뺄셈 = 표현식.match(/(.+?)에서 (.+?)를 뺀값/);
        if (뺄셈) {
            return this.값평가(뺄셈[1]) - this.값평가(뺄셈[2]);
        }

        return 표현식;
    }

    조건평가(조건식) {
        const 크거나같음 = 조건식.match(/(.+?)가 (.+?)보다 크거나같으면/);
        if (크거나같음) {
            return this.값평가(크거나같음[1]) >= this.값평가(크거나같음[2]);
        }

        const 크면 = 조건식.match(/(.+?)가 (.+?)보다 크면/);
        if (크면) {
            return this.값평가(크면[1]) > this.값평가(크면[2]);
        }

        const 같음 = 조건식.match(/(.+?)가 (.+?)와 같으면/);
        if (같음) {
            return this.값평가(같음[1]) === this.값평가(같음[2]);
        }

        return false;
    }

    실행(코드) {
        const 줄들 = 코드.split('\n').map(줄 => 줄.trim()).filter(줄 => 줄.length > 0);
        let 조건스택 = [];

        for (const 줄 of 줄들) {
            // 주석 건너뛰기
            if (줄.startsWith('//')) continue;

            try {
                // 변수 선언
                const 변수선언 = 줄.match(/변수 (.+?)를 (.+?)로 정하라\./);
                if (변수선언) {
                    const 값 = this.값평가(변수선언[2]);
                    this.변수들.set(변수선언[1], 값);
                    continue;
                }

                // 출력
                const 출력 = 줄.match(/(.+?)를 출력하라\./);
                if (출력) {
                    const 실행가능 = 조건스택.length === 0 || 조건스택[조건스택.length - 1];
                    if (실행가능) {
                        const 값 = this.값평가(출력[1]);
                        console.log(값);
                    }
                    continue;
                }

                // 조건문
                const 조건문 = 줄.match(/만약 (.+?)이면/);
                if (조건문) {
                    const 조건결과 = this.조건평가(조건문[1]);
                    조건스택.push(조건결과);
                    continue;
                }

                // 아니면
                if (줄 === '아니면') {
                    if (조건스택.length > 0) {
                        조건스택[조건스택.length - 1] = !조건스택[조건스택.length - 1];
                    }
                    continue;
                }

                // 끝
                if (줄 === '끝.') {
                    if (조건스택.length > 0) {
                        조건스택.pop();
                    }
                    continue;
                }

            } catch (오류) {
                console.error(`오류: ${오류.message}`);
            }
        }
    }

    변수상태() {
        return Object.fromEntries(this.변수들);
    }
}

// CLI 사용법
function 사용법표시() {
    console.log('🏛️  세종대왕의 한글 확장자 처리기');
    console.log('================================');
    console.log();
    console.log('사용법:');
    console.log('  node 한글확장자처리기.js [명령] [파일/디렉토리]');
    console.log();
    console.log('명령어:');
    console.log('  run <파일>     - 한글 확장자 파일 실행');
    console.log('  scan [디렉토리] - 한글 확장자 파일들 스캔 (기본: 현재 디렉토리)');
    console.log('  runall [디렉토리] - 모든 한글 파일 실행');
    console.log('  help          - 도움말 표시');
    console.log();
    console.log('지원하는 확장자:');
    console.log('  .한글    - 세종 프로그래밍 언어');
    console.log('  .세종    - 세종대왕 전용 스크립트');
    console.log('  .조선    - 조선왕조 계산 스크립트');
    console.log('  .창제    - 훈민정음 창제 스크립트');
    console.log();
    console.log('예제:');
    console.log('  node 한글확장자처리기.js run 안녕하세요.한글');
    console.log('  node 한글확장자처리기.js scan');
    console.log('  node 한글확장자처리기.js runall');
}

// 메인 실행부
async function main() {
    const 인수들 = process.argv.slice(2);
    const 처리기 = new 한글확장자처리기();

    if (인수들.length === 0 || 인수들[0] === 'help') {
        사용법표시();
        return;
    }

    const 명령 = 인수들[0];

    switch (명령) {
        case 'run':
            if (인수들.length < 2) {
                console.error('❌ 파일명을 지정해주세요.');
                return;
            }
            await 처리기.파일실행(인수들[1]);
            break;

        case 'scan':
            const 디렉토리 = 인수들[1] || '.';
            처리기.디렉토리스캔(디렉토리);
            break;

        case 'runall':
            const 실행디렉토리 = 인수들[1] || '.';
            await 처리기.모든파일실행(실행디렉토리);
            break;

        default:
            console.error(`❌ 알 수 없는 명령: ${명령}`);
            사용법표시();
    }
}

// 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { 한글확장자처리기, 세종언어인터프리터 };