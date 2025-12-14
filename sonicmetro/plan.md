# Project Pipeline
## 핵심 기능
- 하루 동안 지하철 노선도 상에서 시간표에 따라 
- 지하철 노선도 상의 각 역에 열차가 도착할 때마다 소리가 울림
- 이 소리의 timbre는 호선별로 다름 (아직 구현하지 말 것)
- 각각의 역은 클릭으로 enable/disable이 가능하며, enable된 역에서만 기차가 도착할 때마다 소리를 울림
- 여러 개의 호선이 지나가는 환승역은 enable/disable 시, 그 역을 지나가는 모든 소리가 동시에 enabled/disabled
- 역에 기차가 정차할 때 울리는 소리는 WebChucK로 구현 (ChucK code를 script 안에 embed 가능) 
	- WebChucK documentation: https://chuck.stanford.edu/webchuck/docs/
- 역 별/로 소리에 걸리는 effect customizing 가능 (reverb, tremolo, EQ, wah-wah 등)
- 역별로 pitch는 고정, 단, 새로운 역이 enable될 때 그 역에 assign된 pitch는 randomize (randomize pitch 범위가 너무 넓으면 안 됨)
- 단, 한 호선 상에서 enable된 역이 연속으로 여러 개일 경우, 한 열차가 이 역들을 연속으로 정차할 때 pitch가 2단계씩 상승 ex) 2호선 낙성대-사당-방배 역을 한 열차가 연속 정차 시 'C4, D4, E4'의 소리가 연속으로 울림
	- customizable (pitch 상승 단계 변화 가능, 상승 대신 하강시킬 수도 있음)
- 역에
- 추가로 정보가 필요한 (ex) 각 역 코드, 환승역 정보 등) 경우, 서울시 열린데이터 포털(data.seoul.go.kr)에서 탐색하거나 사용자에게 요청할 것

## UI
- 화면 전체: 수도권 전철 노선도
- 화면 왼쪽 위: 요일 선택 가능 (평일/주말 및 공휴일)
- 화면 오른쪽 위: 시간 재생 속도 (하루 동안 시간이 흐르면서 기차가 역들에 정차할 때 소리가 울리는 템포 조정, default 시간표 1분 = 실제 시간 0.5초) 및 일시정지, 리셋 (그 날 첫차 출발 시각으로 복귀) 및 현재 시간표상 시각 (hh:mm:ss)
- 노선도상의 각 역: 클릭 가능
	- enabled 역은 선명하게 보이며, disabled 역은 그보다 흐리게 보임
	- default: all stations disabled, except for '서울역'
	- 우클릭 시 customize tab이 그 역 옆에 뜸, parameter (reverb, tremolo, EQ, wah-wah 등)조절 가능
	- 각 역에 기차가 도착할 때마다, 소리 재생과 함께 파동이 퍼져나가는 시각적 effect 구현
- 각 노선의 대표 색을 그대로 사용할 것
- 또한, 각 노선 위를 시간표에 맞게 노선 색과 동일한 색의 기차가 지나가는 것을 시각화 (기차는 사각형 점으로 표시) --> 기차의 이동 속력은 한 노선 위에서 constant하게 표현, 출발역의 출발 시각, 도착역의 도착 시각 사이 시간 간격을 이용해 계산하기

## 시간표 데이터 수집
- 서울교통공사_역코드로 지하철 열차 시간표 검색 API
	- 입력시, url을 http://openapi.seoul.go.kr:8088/{인증키}/json/getTrainSch/{pagestart}/{pageend}//N/{상하행방향}/{주말구분}/{호선}
	- 인증키: 50514268696b6f673437644a755a73
	- pagestart: 검색 결과 중 몇 번째 item부터 가져올 것인가를 나타내는 index
	- pageend: 검색 결과 중 몇 번째 item까지 가져올 것인가를 나타내는 index
	- 상하행방향: 상행/하행
	- 주말구분: 평일/주말
	- 호선: 1호선/2호선/3호선/4호선/5호선/6호선/7호선/8호선/9호선/GTX-A/경의중앙선/공항철도/경춘선/수인분당선/신분당선/경강선/우이신설선/서해선/신림선/에버라인/의정부경전철
		- 검색이 안 되는 (검색 결과 item 수 0) 노선은 경고문 print한 뒤 skip
	- 예시: [http://openapi.seoul.go.kr:8088/(인증키)/xml/getTrainSch/1/5/ /N/상행/평일/1호선](http://openapi.seoul.go.kr:8088/sample/xml/getTrainSch/1/5/%20/N/%EC%83%81%ED%96%89/%ED%8F%89%EC%9D%BC/1%ED%98%B8%EC%84%A0)
	- 한 번에 최대 1000개의 item만 가져올 수 있으므로, 처음에 1(pagestart) - 1000(pageend)번 행에 해당하는 데이터를 가져온 뒤 "totalCount" 값을 읽어 그 값의 번호까지 1000개씩 탐색해 api 가져오기

- API call in python (example):
	- import requests
	- response = requests.get(url)
	- print(response.content)
- API response JSON format:
	```
    {  "response" : {    "header" : {      "resultCode" : "00",      "resultMsg" : "NORMAL_CODE"    },    "body" : {      "items" : {        "item" : [ {          "trainno" : "K10",          "trainKnd" : null,          "upbdnbSe" : "상행",          "wkndSe" : "평일",          "lineNm" : "1호선",          "brlnNm" : null,          "stnCd" : "1812",          "stnNo" : "161",          "stnNm" : "인천",          "dptreLineNm" : "1호선",          "dptreStnCd" : "1812",          "dptreStnNm" : "인천",          "dptreStnNo" : "161",          "arvlLineNm" : "1호선",          "arvlStnCd" : "1915",          "arvlStnNm" : "동두천",          "arvlStnNo" : "101",          "trainDptreTm" : "05:40:00",          "trainArvlTm" : null,          "tmprTmtblYn" : "N",          "vldBgngDt" : "2025-05-01T05:00:00",          "vldEndDt" : "2025-07-01T04:59:59",          "crtrYmd" : "20250619"        }, {          "trainno" : "K10",          "trainKnd" : null,          "upbdnbSe" : "상행",          "wkndSe" : "평일",          "lineNm" : "1호선",          "brlnNm" : null,          "stnCd" : "1811",          "stnNo" : "160",          "stnNm" : "동인천",          "dptreLineNm" : "1호선",          "dptreStnCd" : "1812",          "dptreStnNm" : "인천",          "dptreStnNo" : "161",          "arvlLineNm" : "1호선",          "arvlStnCd" : "1915",          "arvlStnNm" : "동두천",          "arvlStnNo" : "101",          "trainDptreTm" : "05:44:00",          "trainArvlTm" : "05:43:30",          "tmprTmtblYn" : "N",          "vldBgngDt" : "2025-05-01T05:00:00",          "vldEndDt" : "2025-07-01T04:59:59",          "crtrYmd" : "20250619"        }, {          "trainno" : "K10",          "trainKnd" : null,          "upbdnbSe" : "상행",          "wkndSe" : "평일",          "lineNm" : "1호선",          "brlnNm" : null,          "stnCd" : "1817",          "stnNo" : "159",          "stnNm" : "도원",          "dptreLineNm" : "1호선",          "dptreStnCd" : "1812",          "dptreStnNm" : "인천",          "dptreStnNo" : "161",          "arvlLineNm" : "1호선",          "arvlStnCd" : "1915",          "arvlStnNm" : "동두천",          "arvlStnNo" : "101",          "trainDptreTm" : "05:46:00",          "trainArvlTm" : "05:45:30",          "tmprTmtblYn" : "N",          "vldBgngDt" : "2025-05-01T05:00:00",          "vldEndDt" : "2025-07-01T04:59:59",          "crtrYmd" : "20250619"        }, {          "trainno" : "K10",          "trainKnd" : null,          "upbdnbSe" : "상행",          "wkndSe" : "평일",          "lineNm" : "1호선",          "brlnNm" : null,          "stnCd" : "1810",          "stnNo" : "158",          "stnNm" : "제물포",          "dptreLineNm" : "1호선",          "dptreStnCd" : "1812",          "dptreStnNm" : "인천",          "dptreStnNo" : "161",          "arvlLineNm" : "1호선",          "arvlStnCd" : "1915",          "arvlStnNm" : "동두천",          "arvlStnNo" : "101",          "trainDptreTm" : "05:48:00",          "trainArvlTm" : "05:47:30",          "tmprTmtblYn" : "N",          "vldBgngDt" : "2025-05-01T05:00:00",          "vldEndDt" : "2025-07-01T04:59:59",          "crtrYmd" : "20250619"        }, {          "trainno" : "K10",          "trainKnd" : null,          "upbdnbSe" : "상행",          "wkndSe" : "평일",          "lineNm" : "1호선",          "brlnNm" : null,          "stnCd" : "1823",          "stnNo" : "157",          "stnNm" : "도화",          "dptreLineNm" : "1호선",          "dptreStnCd" : "1812",          "dptreStnNm" : "인천",          "dptreStnNo" : "161",          "arvlLineNm" : "1호선",          "arvlStnCd" : "1915",          "arvlStnNm" : "동두천",          "arvlStnNo" : "101",          "trainDptreTm" : "05:50:00",          "trainArvlTm" : "05:49:30",          "tmprTmtblYn" : "N",          "vldBgngDt" : "2025-05-01T05:00:00",          "vldEndDt" : "2025-07-01T04:59:59",          "crtrYmd" : "20250619"        } ]      },      "pageNo" : 1,      "numOfRows" : 5,      "totalCount" : 51091    }  }}
	```
