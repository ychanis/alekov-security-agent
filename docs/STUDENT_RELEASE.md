# 케셰브 최종 인수인계·재현 기록 · 22단계

## 릴리스 식별과 판정 범위

| 항목 | 값 |
|---|---|
| 저장소 | https://github.com/ychanis/alekov-security-agent |
| 누적 개발 브랜치 | main |
| 실행 코드 기준 커밋 | bb1070e290a5b792e95b1ac9c1ab889f1b9f4971 |
| 재현 시 checkout | 위 커밋을 detached HEAD로 고정 |
| 시작 틀 버전 | package.json의 0.2.21 |
| 학생 릴리스 상태 | 22단계 인수인계 검증 중. 운영 인증·v1.0 선언 아님 |
| 이번 변경 | docs/STUDENT_RELEASE.md의 최종 후보 재검사 기록 보완. 기존 코드·설정·README·실행 설명서 보존 |
| 제출 커밋 식별 | 이 문서를 포함한 Git 커밋. git rev-parse HEAD로 40자리 값을 확인 |
| 학생 화면 코드 blob | 4a1079468f678417b3d25b3b2c0960dacefe2c96 |
| 21단계 설명서 blob | df88ac1b6c18fb6b1015f5aaf5aa79b8d03e9345 |

문서에 자기 자신을 포함한 커밋의 해시를 미리 만들어 적지 않습니다. 위 40자리 값은 실제 실행을 확인한 **기준 커밋**입니다. 이번 기록 보완 커밋은 별도의 제출 버전이므로 기준 커밋에서 실행한 것을 새 커밋의 실행 결과인 것처럼 바꿔 쓰지 않습니다. 제출 전 최종 커밋을 새 폴더에서 지정하고 동일 검사를 다시 수행합니다. 결과를 기록하면 그 기록의 기준 커밋도 함께 구분합니다. 코드 변경이 생기면 이전 결과는 새 코드의 성공 증거로 재사용하지 않습니다.

21단계 포털 화면에는 2026-11-04 18:35(KST), 커밋 6a860681673c, 여섯 문서 항목 통과가 표시되었음을 사용자가 제공했습니다. 13~20단계도 통과로 표시되었습니다. 이는 제출된 각 커밋의 원문 검토 기록이며 동일 최종 커밋을 실제 운영 환경에서 실행한 증거가 아닙니다.

## 현재 원문과 21단계 설명서 대조

실행 위치·명령·구성도·오류 안내는 [STUDENT_RUNBOOK.md](STUDENT_RUNBOOK.md)를 따릅니다. package.json의 start는 node src/server.mjs, demo는 node src/server.mjs --demo, check는 node --check student/extension.mjs입니다. 외부 npm 의존성이 없고 저장소 최상위 package-lock.json은 없으므로 npm install/npm ci를 필수 절차로 추가하지 않습니다. OSV 대상은 운영자가 승인한 별도 프로젝트일 수 있으며 임의의 잠금 파일·허용 패키지 설정을 만들지 않습니다.

제공 서버, public/app.js, 인증, 판정, 어댑터는 변경하지 않습니다. student/extension.mjs의 8개 표시 함수는 그대로 보존합니다. 로컬 절대경로는 아래 관찰 환경을 식별할 때만 기록하며 앱 실행에 하드코딩된 조건이 아닙니다. 앱은 package.json이 있는 상대적인 앱 폴더에서 시작합니다.

## 실제 수행한 재현 기록

이 절의 실행자는 작성 보조 AI이며 **학생 Windows에서 직접 수행했다는 진술이 아닙니다.** 새 환경은 보조 Linux 컨테이너입니다. 서버 AI의 원문 판정과도 별개입니다.

| 항목 | 환경·절차·관찰 결과 | 시각·근거 |
|---|---|---|
| 새 폴더 준비 | git clone --no-checkout으로 별도 keshev-stage22-repro 폴더 복제. 기존 Windows 작업 폴더 사용·수정 안 함 | 2026-11-04 18:38~18:40 KST, 터미널 출력 |
| 고정 커밋 | 초기 21단계 커밋 확인 후 git fetch origin main, git checkout --detach bb1070e290a5b792e95b1ac9c1ab889f1b9f4971 → HEAD is now at bb1070e | 실제 터미널 출력. 아래 13개 결과는 bb1070e 재검사 기준 |
| 작업 상태 | git status --short 출력 없음 | checkout 직후 확인 |
| 원격 주소 | git remote get-url origin → https://github.com/ychanis/alekov-security-agent.git | 터미널 출력 |
| 런타임 | Node.js v24.22.1, Git 2.51.1, Linux | 버전 명령. 수업 기준 24.19.0과 다름 |
| 설치 | 외부 의존성 설치·다운그레이드 없음 | package.json 원문과 대조 |
| 문법 | npm run check 종료 코드 0 | 실제 실행. http-proxy npm 환경 경고는 있었으나 문법 검사는 통과 |
| 예제 시작 | 환경 ON_PORT=5190, node src/server.mjs --demo. 자식 프로세스에 PATH·ON_PORT만 전달 | 케셰브 예제: http://127.0.0.1:5190 출력 |
| 로컬 HTTP | 아래 13개 확인 통과 | 2026-11-04T09:42:43.998Z = 18:42:43 KST, 실제 실행 출력 |
| 종료 | 테스트가 생성한 서버 프로세스만 SIGTERM 종료 후 접속 거부 확인 | Linux 종료 검사. Windows Ctrl+C와 다름 |
| 재시작 | 같은 커밋·명령·포트 재시작 후 HTTP 200, 종료 | 실제 실행 |
| 브라우저 | Playwright Chromium 실행 시 executable doesn't exist로 시작 불가 | 브라우저 화면·키보드·화면 갱신은 미확인 |
| 실서비스 | 유료 AI 요청 0, 보안 조치 요청 0 | /api/ai 및 /api/actions 호출 안 함. OSV는 미설정 상태 응답만 확인 |

실제 13개 검사는 다음과 같습니다.

| 번호 | 검사 | 관찰 |
|---|---|---|
| 1 | GET / | HTTP 200 |
| 2 | 시작 HTML | 케셰브 문자열 포함 |
| 3 | GET /app.js | HTTP 200 |
| 4 | GET /student/extension.mjs | HTTP 200 |
| 5 | GET /style.css | HTTP 200 |
| 6 | GET /api/me | HTTP 200, practice-user |
| 7 | GET /api/events | HTTP 200, event-01, supportedActions 빈 배열 |
| 8 | GET /api/devices | HTTP 200, 예제 기기 unknown |
| 9 | GET /api/sessions | HTTP 200, 예제 세션 active |
| 10 | GET /api/apps | HTTP 200, 예제 앱 3개 |
| 11 | GET /api/vulnerabilities | HTTP 200, not_configured, packages 빈 배열. 외부 OSV 조회 성공 아님 |
| 12 | 서버 종료 후 GET / | 접속 거부 |
| 13 | 서버 재시작 후 GET / | HTTP 200 |

장시간 분리된 실행 세션을 이용한 첫 HTTP 확인에서는 ECONNREFUSED가 발생했습니다. 서버 생성·요청·종료를 같은 테스트 프로세스에서 관리한 재검사에서 위 결과를 얻었습니다. 첫 실패를 학생 앱의 연결 성공으로 기록하지 않았습니다. 브라우저 실행 파일은 설치하지 않았고 화면 성공을 지어내지 않았습니다.


### 최종 후보 커밋 재검사 증거

초기 6a860681673cfd2996c322df92219d9b0a9d42cf에서의 실행은 이력으로만 남기고, 이 문서의 13개 검사 결과와 단계별 결과표는 아래 **bb1070e 동일 커밋 재검사**를 기준으로 합니다. 서로 다른 커밋의 통과 결과를 합치지 않습니다.

실제 출력:

```json
{"commit":"bb1070e290a5b792e95b1ac9c1ab889f1b9f4971","checkedAt":"2026-11-04T09:42:43.998Z","checks":13,"result":"passed","mode":"demo","paidAiRequests":0,"securityActions":0,"browser":"unverified"}
```

이 커밋에서 npm run check도 종료 코드 0이었고, 재현 뒤 git status --short는 출력이 없었습니다. 초기 커밋과의 git diff --stat 결과는 docs/STUDENT_RELEASE.md 1개 파일 추가뿐이었습니다. 현재 기록 보완에서도 실행 코드·의존성·설정·21단계 문서는 변경하지 않습니다.

| 공식 조건 | 반영 위치·증거 | 현재 한계 |
|---|---|---|
| 누적 원문 일관성 | 21단계 설명서·package.json·학생 8개 함수 대조, 동일 후보 커밋 문법·HTTP 재검사 | 실제 학생 화면 전체 재현 미확인 |
| 이동 가능한 구성 | 새 폴더 clone·고정 커밋·상대 실행 경로·설정 견본·의존성 설치 불필요 명시 | 새 Windows 환경은 사용자 확인 필요 |
| 재현 기록과 원문 | 위 40자리 커밋·시각·버전·환경·13개 관찰·실패 원인 | 보조 AI의 Linux 검사이며 학생 실행 진술 아님 |
| 데이터 보존 계획 | 아래 원본 보존·Git bundle·미커밋·자격·원천 데이터 별도 보존 표 | 실제 백업·복원 미실행 |
| 시연과 학생 진술 구분 | 원문 검토·예제 API·브라우저 미확인·학생 Windows 미실행 구분 | 운영 성공이나 서버의 실행 인증 주장 안 함 |
| 버전과 지원 범위 | 시작 틀 0.2.21, 인수인계 검증 중, 실제 집행 UNV | v1.0·실제 운영 완료로 표시하지 않음 |

## 13~21단계별 기능과 증거

아래는 **같은 기준 커밋**의 기능을 대상으로 한 현재 확인 범위입니다. 과거의 17/49/32개 모의 검사 통과를 이 최종 커밋 전체가 통과했다는 뜻으로 합산하지 않습니다.

| 단계 | 기능·현재 원문 | 이번 재현 결과 | 시각·근거 | 미확인·원인 |
|---|---|---|---|---|
| 13 | renderIdentity, 사용자·기기·세션·unknown | 예제 API 계약 확인 | 18:42:43 KST, /api/me·devices·sessions | 학생 DOM·실제 계정 화면은 브라우저 미실행 |
| 14 | renderDecision, allow/deny/challenge/unknown | 코드 읽기, /api/apps 예제 3개 확인 | 같은 커밋·위 HTTP 출력 | 실제 접근 요청·화면 판정 미실행 |
| 15 | renderEvents, 필터·근거·규칙·상태 | event-01·지원 조치 없음 예제 응답 확인 | 같은 커밋 /api/events | 실제 XDR·필터·상세 조작 미확인 |
| 16 | renderStatus, 진단·알림·빈 상태 | 코드 읽기로 경계 확인 | 같은 커밋 student/extension.mjs | 도움정보·클립보드·실제 오류 화면 미확인 |
| 17 | renderAiConnection, 점검 상태 | 코드 읽기 | 같은 커밋 | 계정·AI 승인·점검 미실행, 유료 요청 안 함 |
| 18 | renderExplanation, 근거 결합·규칙·unknown·미실행 제안 | 코드 읽기 | 같은 커밋 | AI 실제 설명·사건 전환·늦은 응답 화면 미확인 |
| 19 | renderAction, 사람 확인·ACK·효과 관측 구분 | 코드 읽기, 예제 supportedActions 빈 배열 확인 | 같은 커밋 /api/events | 실제 집행기 연결 미준비, 실제 학생 결과 UNV |
| 20 | renderVulnerabilities, 정확한 버전·OSV·부분 실패 유지 | not_configured 응답 확인 | 같은 커밋 /api/vulnerabilities | 실제 승인 패키지·잠금 파일 대조·외부 조회·취소 미확인 |
| 21 | 실행 설명서·구성도·역할 경계·오류 안내 | 명령과 현재 소스 대조, Linux 예제 서버 시작·종료·재시작 | 같은 커밋, 문법·HTTP 검사 | 새 Windows PowerShell·Chrome 재현 미확인 |

unknown은 정상·안전이 아니며, none_found는 앱 안전 보장이 아닙니다. 접수 ACK는 효과가 아닙니다. 실제 효과 확인은 succeeded와 observation.effectApplied === true가 함께 있을 때만 표시하도록 구현되어 있습니다.

## 학생 Windows의 새 폴더 재현 절차

아래 명령은 **학생 PC에서는 아직 미실행**입니다. 실제로 수행한 결과만 해당 커밋과 시각을 함께 기록합니다. 기존 작업 폴더를 삭제·초기화하지 않습니다. 인증·설정·보관소 파일을 복사하지 않습니다.

### 1. 원본 보존 확인

기존 앱 폴더를 파일 탐색기로 열고 주소 표시줄에 powershell을 입력합니다.

```powershell
Get-Location
git rev-parse --show-toplevel
git status --short
git diff --stat
git diff --cached --stat
git log -1 --format="%H %s"
```

출력에서 실제 경로·현재 커밋·커밋되지 않은 변경 유무를 확인합니다. 미커밋 변경이나 스테이징 항목은 기존 작업이므로 그대로 둡니다. 새 복제본에 자동으로 포함된다고 가정하지 않습니다. 현재 AI가 원래 학생 PC에 접근해 보존 상태를 확인한 것은 아닙니다.

### 2. 제출 커밋을 새 폴더에 받기

새 PowerShell에서 다음을 실행합니다. $releaseCommit에는 과제에 제출할 실제 40자리 커밋을 붙여 넣습니다. 입력은 비밀값이 아닙니다. 재현 폴더 이름은 실행 시각으로 정하고 이미 있으면 중단합니다.

```powershell
$releaseRepo = 'https://github.com/ychanis/alekov-security-agent.git'
$releaseCommit = Read-Host '제출할 40자리 커밋'
if ($releaseCommit -notmatch '^[0-9a-fA-F]{40}$') { throw '40자리 커밋을 확인하세요.' }
$releaseFolder = Join-Path ([Environment]::GetFolderPath('UserProfile')) ('keshev-repro-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
if (Test-Path -LiteralPath $releaseFolder) { throw '이미 있는 폴더입니다. 기존 폴더를 보존하세요.' }
git clone --no-checkout $releaseRepo $releaseFolder
if ($LASTEXITCODE -ne 0) { throw '복제 실패. 기존 작업은 그대로 두세요.' }
Set-Location -LiteralPath $releaseFolder
git checkout --detach $releaseCommit
if ($LASTEXITCODE -ne 0) { throw '제출 커밋 확인 실패' }
git rev-parse HEAD
git status --short
```

HEAD가 제출 커밋과 같고 작업 상태가 비어 있는지 확인합니다. 이 저장소는 앱 파일이 최상위이므로 새 복제본에서 on-client 하위 폴더를 추가로 찾을 필요가 없습니다. 비공개 저장소 권한이 없으면 기존 Git 인증 절차를 따르고 토큰을 URL·명령·문서에 넣지 않습니다. GitHub에 없는 로컬 변경을 보존할 때는 원래 Git 최상위를 대상으로 별도 clone하거나 공식 수료 패키지 내보내기 도구를 사용합니다. 이번 공개 원격 절차와 임의로 혼합하지 않습니다.

### 3. 버전·문법·실행

```powershell
node --version
git --version
$PSVersionTable.PSVersion
Get-Content .\package.json
npm run check
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-alekov.ps1 -Demo -Port 5190
```

실행 설명서의 기준은 Node.js 24.19.0이며 시작 도구는 22~24를 허용합니다. 외부 의존성 설치는 필요하지 않습니다. 예제 실행은 계정 연결 설정을 자동 준비하지 않습니다. 명령이 성공하면 코드상 예상 신호는 「케셰브가 켜졌습니다…」와 「서버가 응답한 것만 확인했습니다…」입니다. Chrome에서 http://127.0.0.1:5190/ 을 열고 보호 현황·업무 앱·보안 기록의 예제 표시를 확인합니다. 요청할 때마다 실제 모드와 확인 시각을 남깁니다. AI·집행을 시험 삼아 요청하지 않습니다.

일반 실행·계정 연결은 STUDENT_RUNBOOK.md의 기본 시작 명령과 제공 운영 안내를 따릅니다. 이 예제 검사를 일반 연결 성공으로 바꾸지 않습니다.

### 4. 종료·재시작

실행창 Ctrl+C → 브라우저 같은 주소에서 응답 중단 확인 → 같은 폴더·같은 커밋에서 같은 명령 재실행 → 같은 주소 재접속 순서로 확인합니다. 최종적으로 종료하고 git status --short로 소스 변경 유무를 확인합니다.

| 학생이 채울 실행 기록 | 현재 값 |
|---|---|
| 실제 최종 40자리 커밋·브랜치 | 미확인. detached HEAD의 커밋을 기록 |
| 환경·Node·PowerShell·Chrome 버전 | 미확인 |
| 새 폴더·원본 폴더 보존 확인 | 미확인 |
| 실행·HTML·학생 화면 관찰 시각 | 미확인 |
| 기능별 실제 값·예제 여부 | 미확인 |
| 종료·재실행·오류·남은 과제 | 미확인 |

수정이 필요하면 새 커밋을 만들고 그 커밋을 다른 새 폴더에서 다시 재현합니다. 이전 커밋의 통과 화면이나 실행 결과를 새 버전의 전체 성공으로 옮겨 적지 않습니다.

## 이동 가능한 구성과 데이터 보존 계획

| 보존 대상 | 백업 방법 | 복원·검증 방법 | 제한 |
|---|---|---|---|
| 커밋된 학생 코드·문서·Git 기록 | 원격 저장소와 별도 Git bundle | 새 폴더에 clone, 제출 커밋 확인, status·문법·시작 검사 | push 안 한 변경은 원격에 없음 |
| 미커밋·스테이징 작업 | 기존 폴더 보존. diff --stat 확인 후 사용자가 내용을 검토하고 비밀 없는 소스만 별도 백업 | 원본과 파일별 대조 후 새 복원 폴더에서 적용·새 커밋 | bundle에 미커밋 작업은 포함되지 않음. diff 원문에 비밀 가능하므로 자동 업로드 안 함 |
| 학생 꾸밈·이미지 등 추가 파일 | 추적 여부 확인 후 비밀 없는 학생 파일을 백업에 포함 | 새 폴더에서 동일 표시와 파일 해시 확인 | 이 단계에서 꾸밈·포장·설치 검증 안 함 |
| 개인 계정 설정·보관소·인증서 | 프로젝트 밖에서 운영 정책에 따른 별도 보안 보존. 이 문서·Git·제출 ZIP 제외 | 새 환경에서는 제공 도구로 설정을 준비하고 본인 로그인·승인을 다시 확인 | 복사만으로 권한 복원되지 않음. 토큰·암호·개인키 공유 금지 |
| 원천 시스템의 기록·조치 결과 | 원천 시스템 담당자의 보존 절차 | 본인 범위에서 재조회·requestId/receiptId 대조 | 로컬 UI가 백업하는 자료가 아님 |
| 캡처·재현 기록·포털 판정 | 비밀을 제거하고 해당 커밋·시각·환경을 함께 보관 | 원문 검토와 실행 검증을 구분하여 대조 | 포털 기록이 실제 집행 증거가 아님 |

Git 최상위에서 새 외부 백업 경로를 정해 bundle을 만들 수 있습니다. 아래는 **계획이며 아직 백업·복원 실행하지 않았습니다.**

```powershell
$releaseRoot = (git rev-parse --show-toplevel)
if ($LASTEXITCODE -ne 0) { throw 'Git 최상위 확인 실패' }
$releaseBackup = Join-Path (Split-Path -Parent $releaseRoot) ('keshev-history-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.bundle')
if (Test-Path -LiteralPath $releaseBackup) { throw '기존 백업을 보존하세요.' }
git bundle create $releaseBackup --all
if ($LASTEXITCODE -ne 0) { throw '백업 생성 실패' }
git bundle verify $releaseBackup
Get-FileHash -Algorithm SHA256 -LiteralPath $releaseBackup
```

bundle에는 모든 Git 이력이 들어가므로 공개 전 과거 커밋의 비밀 포함 여부도 별도 검토해야 합니다. .gitignore만으로 이미 추적된 비밀이 사라지지 않습니다. bundle을 공개 업로드하지 않습니다. 복원은 검증한 bundle을 git clone으로 새 폴더에 받고, 제출 커밋 checkout → 문법 → 예제 실행 → 브라우저 → 종료·재실행 순서로 확인합니다. 원본에 덮어써 복원하지 않습니다. 백업·복원 성공은 아직 미확인입니다.

브라우저의 현재 선택·DOM·메모리 상태는 영구 백업 대상이 아닙니다. 조치 확인 티켓은 제공 화면 메모리에서만 취급하고 문서·저장소·복원 파일로 만들지 않습니다. 취소·재시작이 원천 조치 효과를 되돌리지는 않습니다.

## 알려진 한계·미완료

- 학생 Windows 새 환경·Chrome 화면·키보드·클립보드는 미확인입니다. 보조 Linux의 HTTP 확인과 구분합니다.
- 실제 SDP/XDR 개인 권한·인증서·연결은 미확인입니다. 기본 disconnected는 성공이나 침해 없음이 아닙니다.
- 실제 AI 연결·권한·설명은 미확인입니다. 유료 요청을 반복하지 않습니다.
- 실제 조치 집행기 연결은 준비되지 않았으며 실제 학생 결과는 기다림(UNV)입니다. 이 항목을 전체 목표에서 삭제하지 않습니다.
- OSV는 승인 프로젝트·정확한 설치 버전이 필요합니다. 이번에는 not_configured만 실제 확인했고 외부 OSV 조회를 하지 않았습니다.
- 학생 renderAction 안내에는 공식 「연동 시스템 결과만 재조회」 문구가 남아 있으나 실제 제공 버튼은 「원천 결과만 재조회」입니다. STUDENT_RUNBOOK.md에 차이를 기록했습니다. 문서 단계에서 UI를 바꾸지 않습니다.
- 설치형 전체 앱·수료용 도구·개인 AI 키트·다른 운영체제 배포는 이번 검증 범위가 아닙니다.

## 제출·인수인계

22단계는 현재 커밋의 코드·README·설정 설명·이 기록·보존 계획을 함께 읽는 원문 검토입니다. 통과하더라도 서버가 명령을 실행했거나 실제 운영을 인증한 것은 아닙니다.

과제 화면에 저장소 URL과 이 문서를 포함한 실제 40자리 제출 커밋을 직접 입력합니다. 워크벤치 「포털 제출 준비」는 현재 13~20단계 범위이므로 22단계에 사용하지 않습니다. 비공개 원문은 22단계의 「비공개 저장소 원문 준비 방법」에서 도구를 받고, ZIP·JSON 폴더를 프로젝트 밖에 둔 뒤 Git 최상위에서 안내 명령에 실제 도구·출력 경로와 --commit 값을 지정합니다. 도구 경로·학생 PC 경로를 아직 확인하지 못했으므로 임의 명령을 만들지 않습니다.

JSON을 같은 단계에 선택하고 저장소·커밋·단계를 확인한 뒤 사용자가 제출합니다. 원문 전송만 실패하면 기존 접수를 보존하고 「원문만 다시 보내기」를 사용합니다. 원문 접수·AI 판정·학생 진술·실제 실행을 각각 구분합니다. 이 작업에서 단계 제출·유료 AI 요청·보안 조치를 실행하지 않았습니다.
