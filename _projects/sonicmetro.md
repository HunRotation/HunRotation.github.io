---
layout: project
title: "SonicMetro: An Audible Subway Map Powered by WebChucK"
description: Gyehun Go
img: assets/img/sonicmetro/subwaymap_sup.jpg
importance: 2
category: class project
project_key: 
---

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  vertical-align: middle;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--global-theme-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--global-theme-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.toggle-container {
    text-align: center; 
    margin: 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.toggle-label {
    font-size: 1.1rem;
    cursor: pointer;
    color: #888;
    transition: color 0.3s;
}

.toggle-label.active {
    font-weight: bold;
    color: var(--global-theme-color);
}
</style>

<div class="buttons" style="text-align: center; margin: 2rem 0;">
    <a href="https://hunrotation.github.io/sonicmetro" class="btn" role="button" target="_blank" rel="noopener noreferrer" style="background-color: var(--global-theme-color); border-color: var(--global-theme-color);"><i class="fa-solid fa-train" style="margin-right: 0.5rem;"></i>Try it now!</a>
    <a href="https://github.com/HunRotation/HunRotation.github.io/tree/main/sonicmetro" class="btn" role="button" target="_blank" rel="noopener noreferrer" style="background-color: var(--global-theme-color); border-color: var(--global-theme-color);"><i class="fa-brands fa-github" style="margin-right: 0.5rem;"></i>Code</a>
</div>

<div class="toggle-container">
    <span id="label-eng" class="toggle-label active" onclick="setLang('eng')">Eng</span>
    <label class="switch">
        <input type="checkbox" id="lang-toggle">
        <span class="slider"></span>
    </label>
    <span id="label-kor" class="toggle-label" onclick="setLang('kor')">한글</span>
</div>


<div id="eng-content" markdown="1">

# Background
Even today, countless trains on the Seoul metropolitan subway carry people to their destinations along the tracks. And they repeat the cycle of stopping at designated stations at designated times (probably...) according to the timetable and departing again. There are currently 24 such lines where trains run in the Seoul metropolitan area, and hundreds of trains move on them in their own orderly patterns. However, there are too many trains and stations to see that pattern at a glance, and the subway map is too complex to grasp it all. So, what if we could *listen* to this pattern instead of just seeing it?

My project **SonicMetro** started from this idea. What if sound was generated every time a train stopped at a station, and those sounds came together? It might sound like noise at first, but since there is a beautiful pattern in the movement of trains, those noise-like sounds might come together to create beautiful music. The music created in this way will convey the beautiful patterns created by the trains through a different sense.
---
# How It Works

## Train Schedule

Using the [Seoul Metro Train Schedule Status API](https://data.seoul.go.kr/dataList/OA-22750/A/1/datasetView.do) provided by Seoul, all recorded weekday/weekend timetables were collected and converted into data. Based on this, the operation schedule of each train was separated and used as the base data for the timetable simulation.

## Metro Map

The coordinates of each station were extracted from the [Metropolitan Subway Map](https://www.data.go.kr/data/15120713/fileData.do) Korean (KOR) version provided by Seoul Metro, and each station was connected with straight lines using vector graphics. Since all stations are connected by straight lines, the shape of the vector graphics may differ from the actual subway map in some sections with curves or bends.

## Sound Production

All sounds produced when a train stops at a station are implemented with [WebChucK](https://chuck.cs.princeton.edu/webchuck/). WebChucK is a programming language that ports ChucK code to JavaScript, allowing you to freely synthesize and play desired sounds.
---
# How To Use

<img src="/assets/img/sonicmetro/sonicmetro_tutorial.jpeg" style="width: 100%;">

1. This is the main subway map screen. The stations that trains will pass through and the paths between stations are implemented as vector graphics on top of the official map provided by Seoul Metro.
   - If you click on a white circle on a station, it becomes a large yellow circle. This means the station is **enabled**. When a train stops at an enabled station, a sound corresponding to that train's line is played. Different lines play sounds with different base pitches and timbres.
   - If you click on an enabled station again, the large yellow circle becomes a small white circle again, and the station is **disabled**.
   - For transfer stations, all positions on all lines are enabled/disabled simultaneously.
   - If you click on the line connecting stations, you can disable/enable that line. Trains on a disabled line and the line itself are displayed in gray, and no sound is played even if they stop at an enabled station.
   - When a single train passes through consecutive stations on the same line, the pitch gradually rises or falls. For upward/inner circle directions, the pitch rises by one step, and for downward/outer circle directions, it falls by one step. This allows for various pitches to be played even on the same line. The rise and fall occur up to a maximum of one octave, and if it passes through subsequent stations beyond that, it rises/falls from the initial pitch again.
2. Click this button to switch the timetable between Weekday(평일) and Weekend(주말). Clicking it resets the simulation time, but enabled stations are not reset.
3. Move the slider to jump to any time between the first train's departure and the last train's arrival.
4. Clicking buttons that match the color of each line will play that line's unique sound once. You can use these buttons to preview the sound of each line.
5. This panel displays a list of currently enabled stations by line. If a line is disabled, the line name and symbol in this panel are also displayed in gray.
6. This webpage simulates the time from the earliest departure of all first trains to the latest arrival of all last trains in a day. You can check the currently simulated time through this timer.
7. Buttons to control the simulation.
   - Play: Plays the simulation. When playing for the first time, it may take some time for WebChucK to load.
   - Pause: Pauses the simulation.
   - Reset: Resets the simulation time and all enabled stations.
   - Export: A button to download a .json file containing timetables for all trains.
8. A slider to control the speed of the simulation. It can be adjusted between 0.1x - 10x, and at the default speed of 1x, 1 minute in the simulation is played during 1 real-world second.
---
# Future Direction
Currently, **SonicMetro** has implemented a total of 10 lines: 1-9호선 and 경의중앙선. This project will continue to be updated until all Seoul metropolitan subway lines are implemented, and the official version will be released when all lines are implemented.

In addition, I plan to supplement and add the following:
- currently, there is a bug where express trains on all lines except Line 9 stop at every station. I plan to correct the timetables for express trains in the future.
- There is a bug where trains rotate rapidly to point to the next direction when stopping at some stations. I plan to fix the station stop animation to be more natural.
- I plan to add a function to customize the sounds assigned to each line.

If you find any bugs or points for improvement while using this project, please feel free to report them to rotation@kaist.ac.kr!
---
# Demo


<iframe width="560" height="315" src="https://www.youtube.com/embed/PR7BaGUhWjc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width: 100%; aspect-ratio: 16/9;"></iframe>

</div>

<div id="kor-content" style="display: none;" markdown="1">

# Background
오늘도 수도권 전철 위에서는 철로 선을 따라 수많은 열차들이 사람들을 원하는 곳으로 데려다 줍니다. 그리고 이들은 시간표를 따라 (아마도...) 정해진 때에 정해진 역에 멈추고 다시 출발하기를 반복하죠. 이렇게 기차가 다니는 선만 현재 수도권에 24개가 있고, 그 위에 수백 대의 열차가 나름 질서정연한 패턴을 보이며 움직입니다. 하지만 그 패턴을 한 눈에 들여다 보기에 열차와 역은 너무 많고, 지하철 노선도는 너무 복잡합니다. 그렇다면, 이 패턴을 눈으로 보는 게 아니라 귀로 들으면 어떨까요?

저의 프로젝트 **SonicMetro**는 이 아이디어에서 시작한 프로젝트입니다. 열차가 역에 설 때마다 소리를 내고, 그 소리가 한데 모이면 어떨까요? 자칫 소음처럼 들릴지도 모르지만, 기차의 움직임에는 아름다운 패턴이 있기에 그 소음 같은 것들이 모이면서 질서를 갖춘 음악을 자아낼지도 모릅니다. 이렇게 만들어진 음악이, 기차들이 모아 만든 아름다운 패턴을 색다른 감각으로 전달할 것입니다.
---
# How It Works

## Train Schedule

서울특별시에서 제공하는 [교통공사 지하철역 열차시간표 현황 API](https://data.seoul.go.kr/dataList/OA-22750/A/1/datasetView.do)를 이용하여 기록된 평일/주말의 모든 시간표를 수집하여 데이터화하였습니다. 이를 기반으로, 각 열차의 운행 시간표를 분리해 시간표 시뮬레이션의 기반 데이터로 사용하였습니다.

## Metro Map

서울교통공사에서 제공하는 [수도권 지하철 노선도](https://www.data.go.kr/data/15120713/fileData.do) 국문(KOR) 버전에서 각 역의 위치를 좌표로 추출하여, 벡터 그래픽으로 각 역을 직선으로 연결하였습니다. 모든 역이 직선으로 이어져 있어 굴곡이나 꺾임이 있는 일부 구간에서 노선도와 벡터 그래픽의 형태가 다를 수 있습니다.

## Sound Production

열차가 역에 정차할 때 나는 모든 음성은 [WebChucK](https://chuck.cs.princeton.edu/webchuck/)으로 구현됩니다. WebChucK은 JavaScript 상에 ChucK 코드를 이식하여, 원하는 음성을 자유롭게 합성하여 재생할 수 있는 프로그래밍 언어입니다.
---


# How To Use

<img src="/assets/img/sonicmetro/sonicmetro_tutorial.jpeg" style="width: 100%;">

1. 메인이 되는 수도권 지하철 노선도 화면입니다. 서울교통공사에서 제공하는 공식 노선도 위에 벡터 그래픽으로 열차들이 지나갈 역 및 역 사이 경로가 구현되어 있습니다.
   - 각 역 위에 있는 하얀 원을 클릭할 경우, 큰 노란색 원이 됩니다. 이는 해당 역이 활성화(enabled)되었다는 의미입니다. 활성화된 역에 열차가 정차할 경우 해당 열차의 노선에 맞는 음이 재생됩니다. 노선별로 다른 기본 음정 및 음색의 음을 재생합니다.
   - 활성화된 상태의 역을 다시 클릭할 경우, 큰 노란색 원이 다시 작은 흰색 원이 되며 해당 역이 비활성화(disabled)됩니다.
   - 환승역의 경우 모든 노선상의 위치가 동시에 활성화/비활성화됩니다.
   - 역 사이를 잇는 선을 클릭할 경우 해당 노선을 비활성화/활성화시킬 수 있습니다. 비활성화된 노선은 전체 선과 그 선 위를 지나가는 모든 열차가 회색으로 표시되며, 활성화된 역에 정차해도 음이 재생되지 않습니다.
   - 같은 노선 상에 있는 연속된 역을 하나의 열차가 통과할 경우, 음정이 점차 상승하거나 하강합니다. 상행/내선 방향의 경우 음정이 한 단계씩 상승, 하행/외선 방향의 경우 한 단계씩 하강합니다. 이를 통해 동일 노선에서도 다양한 음정을 재생할 수 있습니다. 상승 및 하강은 최대 1옥타브까지 이루어지며, 그 이상 연속된 역 통과 시 다시 처음 음부터 상승/하강합니다.
2. 해당 버튼을 클릭하여 시간표를 평일/주말 사이에서 전환할 수 있습니다. 클릭 시 시뮬레이션 시각이 초기화되며, 활성화된 역은 초기화되지 않습니다.
3. 슬라이더를 움직여 첫차 발차 시각부터 막차 종착 시각 사이 원하는 시각으로 이동할 수 있습니다.
4. 각 노선과 색이 일치하는 버튼을 누를 시 해당 노선의 고유 음을 1회 재생합니다. 이 버튼들을 통해 각 노선의 음을 미리 들어볼 수 있습니다.
5. 현재 활성화된 역들의 목록을 호선별로 표시하는 패널입니다. 노선이 비활성화된 경우, 해당 패널에서도 노선명 및 기호가 회색으로 표시됩니다.
6. 이 웹페이지에서는 하루의 모든 첫차 중 가장 이른 발차 시각부터 모든 막차 중 가장 늦은 종착 시각까지의 시간을 시뮬레이션합니다. 해당 타이머를 통해 현재 시뮬레이션되고 있는 시각을 확인할 수 있습니다.
7. 시뮬레이션을 조작할 수 있는 버튼들입니다.
   - Play: 시뮬레이션을 재생합니다. 처음 재생할 경우, WebChucK가 로딩되는 데 시간이 소요될 수 있습니다.
   - Pause: 시뮬레이션을 일시 정지합니다.
   - Reset: 시뮬레이션 시각 및 모든 활성화된 역이 초기화됩니다.
   - Export: 모든 열차별 시간표가 포함된 .json 파일을 다운로드할 수 있는 버튼입니다.
8. 시뮬레이션의 속도를 조절할 수 있는 슬라이더입니다. 0.1x - 10x 사이로 조절할 수 있으며, 기본 속도인 1x의 경우 현실의 1초 동안 시뮬레이션상의 1분이 재생됩니다.
---
# Future Direction
현재 **SonicMetro**에 구현된 선은 수도권 1-9호선 및 경의·중앙선으로 총 10개입니다. 이 프로젝트는 수도권의 모든 전철 노선이 구현될 때까지 계속 업데이트될 것이며, 모든 노선이 구현되었을 때 비로소 정식 버전이 공개될 예정입니다.

이 외에 다음 사항들을 보완 및 추가하고자 합니다.
- 현재 9호선을 제외한 모든 노선의 급행열차가 모든 역에 각역 정차하는 버그가 있습니다. 추후 급행 열차의 시간표를 일괄 수정할 예정입니다.
- 기차가 일부 역에 정차 시 빠르게 회전하여 다음 이동할 방향을 가리키는 버그가 있습니다. 역 정차 애니메이션을 보다 자연스럽게 수정할 예정입니다.
- 각 호선에 배정된 음을 커스터마이징하는 기능을 추가할 예정입니다.

이외에 이 프로젝트를 이용하시면서 발견하신 버그나 개선할 만한 점은 언제든 rotation@kaist.ac.kr로 제보 부탁드립니다!
---
# Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/PR7BaGUhWjc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="width: 100%; aspect-ratio: 16/9;"></iframe>

</div>

<script>
    const toggle = document.getElementById('lang-toggle');
    const engDiv = document.getElementById('eng-content');
    const korDiv = document.getElementById('kor-content');
    const lblEng = document.getElementById('label-eng');
    const lblKor = document.getElementById('label-kor');

    function updateView() {
        if (toggle.checked) {
            engDiv.style.display = 'none';
            korDiv.style.display = 'block';
            lblEng.classList.remove('active');
            lblKor.classList.add('active');
        } else {
            engDiv.style.display = 'block';
            korDiv.style.display = 'none';
            lblEng.classList.add('active');
            lblKor.classList.remove('active');
        }
    }

    toggle.addEventListener('change', updateView);
    
    // Explicit functions for label clicking
    window.setLang = function(lang) {
        if (lang === 'eng') {
            toggle.checked = false;
        } else {
            toggle.checked = true;
        }
        updateView();
    }
</script>