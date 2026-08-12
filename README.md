# 한끼 반짝

유치원 교사가 메뉴 5개를 입력하면 음식 사진을 찾아 실제 스테인리스 식판 형태의 급식 이미지를 만드는 Next.js 서비스입니다. 이미지 검색 결과는 Supabase에 캐시되고, 직접 촬영한 사진 업로드, PNG 저장, 날짜별 급식 기록과 불러오기를 지원합니다.

## 주요 기능

- `/` 또는 줄바꿈으로 밥·국·반찬 3개 일괄 입력
- Google Custom Search JSON API 이미지 검색 및 Supabase 캐시 우선 사용
- 메뉴별 후보 사진 선택과 직접 업로드
- 실제 식판형 반응형 미리보기, PNG 다운로드
- Supabase Storage에 최종 PNG 저장 및 날짜별 기록 저장/불러오기
- 하나의 메뉴 검색이 실패해도 나머지는 계속 처리

## 설치와 로컬 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 배포 전에는 `npm run build`로 확인합니다.

## Supabase 설정

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 `supabase/migrations/001_initial.sql` 전체를 실행합니다.
3. SQL이 `meal-images`, `meal-trays` 공개 버킷도 생성합니다. 이미 있다면 Storage 화면에서 Public 상태인지 확인합니다.
4. Project Settings → API에서 Project URL, Publishable key, service_role key를 확인합니다.
5. `.env.local`에 입력합니다. service role 키는 절대 브라우저 코드나 Git에 넣지 마세요.

RLS가 켜져 있으며 브라우저의 테이블 쓰기는 허용하지 않습니다. 데이터 및 Storage 쓰기는 오직 서버 API가 service role로 수행하도록 분리되어 있습니다. 공개 버킷은 최종 이미지 표시를 위해 읽기만 공개합니다. 향후 로그인 기능을 추가할 때 사용자별 정책을 추가할 수 있습니다.

## Google 이미지 검색 API 설정

1. Google Cloud Console에서 Custom Search API를 활성화하고 API 키를 발급합니다.
2. Programmable Search Engine에서 검색엔진을 만들고 전체 웹 이미지 검색을 허용합니다.
3. 검색엔진 ID(cx)를 복사합니다.
4. `GOOGLE_API_KEY`, `GOOGLE_SEARCH_ENGINE_ID`에 값을 넣습니다.

키가 없으면 화면은 열리지만 검색 시 친절한 설정 안내가 표시됩니다. 키는 서버 Route에서만 읽습니다. Google 검색 결과의 원본 서버가 CORS를 허용하지 않으면 PNG 캡처가 실패할 수 있으므로, 운영 시 선택 이미지를 Storage로 복사하거나 직접 업로드 이미지를 쓰는 것이 가장 안정적입니다.

## 환경변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=
```

`.env.local`은 `.gitignore`에 포함되어 있습니다.

## Vercel 배포

GitHub 저장소를 Vercel에서 Import하고 위 환경변수 5개를 Production, Preview, Development 환경에 각각 추가한 뒤 Deploy합니다. Vercel Marketplace의 Supabase Integration을 사용해도 되고 수동 입력해도 동일하게 동작합니다.

```bash
npm install -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_API_KEY
vercel env add GOOGLE_SEARCH_ENGINE_ID
vercel --prod
```

환경변수를 로컬로 가져오려면 `vercel env pull .env.local`을 사용합니다.

## 문제 해결

- 검색 실패: Google API 활성화, 할당량, API 키 제한, 검색엔진 ID를 확인합니다.
- DB 저장 실패: migration 실행 여부와 service role 키를 확인합니다.
- 업로드 실패: 두 Storage 버킷이 Public인지, 파일이 8MB 이하인지 확인합니다.
- PNG 저장 실패: 외부 이미지 CORS 문제입니다. 직접 업로드한 사진을 사용하면 해결됩니다.
- 빌드 실패: Node.js 20 이상에서 `npm install` 후 `npm run build`를 다시 실행합니다.
