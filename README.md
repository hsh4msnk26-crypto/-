# 한끼 반짝

유치원 교사가 메뉴 5개를 입력하면 무료 음식 사진을 찾아 실제 스테인리스 식판 형태의 급식 이미지를 만드는 Next.js 서비스입니다.

## 주요 기능

- 밥·국·반찬 3개 일괄 입력
- Openverse 공개 라이선스 이미지 검색 — 별도 검색 API 키 불필요
- 이미지 작가·출처·라이선스 표시 및 Supabase 캐시 저장
- 메뉴별 후보 선택과 직접 촬영 사진 업로드
- 식판 미리보기와 PNG 다운로드
- 날짜별 급식 기록 저장·불러오기

## 로컬 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 배포 전에는 `npm run build`를 실행합니다.

## Supabase 설정

1. Supabase 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/migrations/001_initial.sql`을 실행합니다.
3. 이어서 `supabase/migrations/002_openverse_attribution.sql`을 실행합니다.
4. Project Settings → API에서 Project URL, Publishable key, service_role key를 확인합니다.
5. `.env.local`에 아래 값을 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`service_role` 키는 서버 Route에서만 사용하며 Git에 커밋하면 안 됩니다. RLS가 활성화되어 브라우저의 직접 쓰기는 차단됩니다. SQL migration은 `meal-images`, `meal-trays` 공개 Storage 버킷도 생성합니다.

## 무료 이미지 검색

Openverse의 익명 검색 API를 사용하므로 Google API 키나 별도 이미지 검색 키가 필요하지 않습니다. 검색은 상업적 이용 및 수정이 가능한 공개 라이선스 사진으로 제한하며 다음 정보를 함께 저장합니다.

- 작가 이름
- 라이선스 종류와 원문 링크
- 원본 이미지 출처 링크
- Openverse가 제공하는 권장 저작자 표시 문구

한국 급식 메뉴의 검색 결과가 부족하면 일부 대표 메뉴는 영어 유사 검색어로 한 번 더 검색합니다. 결과가 없을 때는 교사가 직접 촬영한 사진을 업로드할 수 있습니다. 이미지별 라이선스 조건은 원본 출처에서 최종 확인하는 것을 권장합니다.

## Vercel 배포

GitHub 저장소를 Vercel에서 Import하고 Supabase 환경변수 3개를 Production, Preview, Development에 추가합니다.

```bash
npm install -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod
```

## 문제 해결

- 무료 사진 검색 실패: Openverse가 일시 제한 중인지 확인하고 잠시 후 다시 시도합니다.
- 검색 결과 없음: 메뉴명을 짧게 바꾸거나 직접 사진을 업로드합니다.
- DB 저장 실패: 두 migration과 Supabase service role 키를 확인합니다.
- 업로드 실패: Storage 버킷의 Public 상태와 8MB 파일 제한을 확인합니다.
- PNG 저장 실패: 외부 이미지의 CORS 제한일 수 있으므로 직접 업로드 사진을 사용합니다.
