# Let's Pick 1.4.11 플랫폼 테스트 보고서

작성일: 2026-10-27

## 자동 검증

- `node --check` — `content.js`, `video-finder.js`, `service-worker.js`, `downloader.js` 통과
- `node --test tests/*.test.js` — 10개 통과
- `git diff --check` — 통과

## 기능 매트릭스

| 플랫폼 | 썸네일/이미지 | 영상 후보 수집 | 저장 경로 | 제한 |
| --- | --- | --- | --- | --- |
| YouTube | 지원 | 직접 파일·매니페스트·재생 fallback 판정 | 썸네일, 링크, 사용자 재생 녹화 | 공식 정책·DRM·서명 스트림 |
| TikTok | 지원 | `playAddr`·`downloadAddr`·네트워크 전체 파일 판정 | 직접 파일, 실패 시 세션 재시도·녹화 | 만료 URL, 403, 로그인 권한 |
| Instagram | 지원 | `video_versions`·DASH/HLS·CDN 전체 파일 판정 | 직접 파일 또는 비암호화 스트림 병합 | CDN Referer·권한·만료 |
| Facebook | 지원 | `browser_native_*`·GraphQL 전달 파일 판정 | 직접 파일 또는 비암호화 스트림 병합 | 프라이버시 검사·CDN 권한 |
| Vimeo | 지원 | 직접 MP4·HLS/DASH | 원본 또는 MP4 병합 | 서명 만료·DRM |
| Daum/Naver | 지원 | HLS/DASH·직접 파일 | MP4 병합 또는 원본 | 라이브·세션 URL |

## 이번 버전의 핵심 수정

1. `googlevideo`, `fbcdn`, `cdninstagram`, `tiktokcdn`을 호스트명만으로 버리지 않고 세그먼트/range 요청만 제외합니다.
2. 직접 다운로드가 실패하면 현재 페이지의 Referer와 쿠키를 사용해 한 번 더 검증합니다.
3. 영상 MIME이 아닌 JSON·HTML·오디오 응답은 영상 저장 후보에서 제외합니다.
4. 직접 파일 실패 시 같은 영상의 비암호화 스트림 또는 녹화 fallback을 선택합니다.
5. HLS/DASH 다운로드 요청에도 현재 페이지의 참조 URL을 전달합니다.

## 저장할 수 없는 경우

DRM 복호화, 안티봇 우회, 비공개 콘텐츠 접근, 만료된 서명 URL 복원은 지원하지 않습니다. 이 경우 패널에 저장 불가 사유를 표시하고, 가능한 경우 게시물 링크·임베드·썸네일·사용자 재생 녹화 경로를 제공합니다.

