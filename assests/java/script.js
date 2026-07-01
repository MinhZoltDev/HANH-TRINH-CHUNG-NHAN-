/*
  Hanh Trinh Chung Nhan V2
  DATA STRUCTURE:
  - BIBLE_PUZZLE_POOL stores 50 Bible-coordinate puzzles.
  - difficulty controls which stage band can draw the puzzle:
    easy = stage 1-5, medium = 6-10, hard = 11-15, extreme = 16-20.
  - keyCoords are "book chapter, verse, word-position" references used as the key.
  - cipherCoords are the coordinate chain shown as the ciphertext.
  - answer is still stored locally for checking. Input checking ignores Vietnamese accents.
*/

/* ==========================================================
   NEW TESTAMENT CIPHER ENGINE V1
   Thay thế Bible Coordinate
========================================================== */

const NEW_TESTAMENT_EVENTS = [

["Chúa Giêsu Chịu Phép Rửa","easy"],
["Chúa Gọi Các Môn Đệ","easy"],
["Tiệc Cưới Cana","easy"],
["Chúa Hóa Bánh Ra Nhiều","easy"],
["Chúa Đi Trên Mặt Nước","easy"],
["Chúa Dẹp Yên Biển Động","easy"],
["Người Samari Nhân Hậu","easy"],
["Đứa Con Hoang Đàng","easy"],
["Chúa Chữa Người Mù","easy"],
["Chúa Chữa Người Phong","easy"],

["Chúa Hiển Dung","medium"],
["Ladarô Sống Lại","medium"],
["Maria Xức Dầu","medium"],
["Chúa Rửa Chân Môn Đệ","medium"],
["Bữa Tiệc Ly","medium"],
["Chúa Cầu Nguyện Ghếtsêmani","medium"],
["Giuđa Phản Bội","medium"],
["Phêrô Chối Chúa","medium"],
["Chúa Chịu Đòn","medium"],
["Ông Philatô Xét Xử","medium"],

["Chúa Chịu Đóng Đinh","hard"],
["Chúa Tắt Thở","hard"],
["Ngôi Mộ Trống","hard"],
["Chúa Phục Sinh","hard"],
["Chúa Hiện Ra Với Maria","hard"],
["Chúa Hiện Ra Với Tôma","hard"],
["Hai Môn Đệ Emmaus","hard"],
["Chúa Lên Trời","hard"],
["Lễ Ngũ Tuần","hard"],
["Phêrô Rao Giảng","hard"],

["Ba Nghìn Người Trở Lại","extreme"],
["Stêphanô Tử Đạo","extreme"],
["Saolô Trở Lại","extreme"],
["Phaolô Rao Giảng","extreme"],
["Phaolô Bị Bắt","extreme"],
["Phaolô Đến Roma","extreme"],
["Thiên Thần Giải Cứu Phêrô","extreme"],
["Cornêliô Đón Tin Mừng","extreme"],
["Công Đồng Giêrusalem","extreme"],
["Khải Huyền Của Gioan","extreme"]

];
const DIFFICULTY_LABELS = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
  extreme: "Cực khó"
};
// CAESAR
function caesarEncrypt(text,shift){

text=normalizeCipherText(text);

let result="";

for(const ch of text){

if(ch===" "){

result+=" ";
continue;

}

const code=ch.charCodeAt(0)-65;

const next=((code+shift)%26)+65;

result+=String.fromCharCode(next);

}

return result;

}
// MORSE
function morseEncrypt(text){
    
    text=normalizeCipherText(text);
    
    return [...text].map(c=>{
        
        if(c===" ") return "/";
        
        return MORSE_TABLE[c]||c;
        
    }).join(" ");
    
}
// ĐẢO CHỮ 
function reverseEncrypt(text){
    
    return normalizeCipherText(text)
    
    .split(" ")
    
    .map(w=>w.split("").reverse().join(""))
    
    .join(" ");
    
}
// RAIL FENCE CIPHER
function railFenceEncrypt(text, rails = 3) {

    text = normalizeCipherText(text).replace(/ /g, "");

    if (rails <= 1) return text;

    const fence = [];

    for (let i = 0; i < rails; i++) {
        fence.push([]);
    }

    let row = 0;
    let dir = 1;

    for (const ch of text) {

        fence[row].push(ch);

        row += dir;

        if (row === rails - 1)
            dir = -1;

        else if (row === 0)
            dir = 1;
    }

    return fence.map(r => r.join("")).join(" ");
}
// ATBASH
function atbashEncrypt(text){

    text=normalizeCipherText(text);

    let result="";

    for(const ch of text){

        if(ch===" "){

            result+=" ";
            continue;

        }

        const code=ch.charCodeAt(0)-65;

        result+=String.fromCharCode(90-code);

    }

    return result;

}
// VIGENERE
const VIGENERE_KEY="GOSPEL";

function vigenereEncrypt(text){

    text=normalizeCipherText(text);

    let result="";
    let k=0;

    for(const ch of text){

        if(ch===" "){

            result+=" ";
            continue;

        }

        const p=ch.charCodeAt(0)-65;

        const key=VIGENERE_KEY[k%VIGENERE_KEY.length].charCodeAt(0)-65;

        result+=String.fromCharCode(
            ((p+key)%26)+65
        );

        k++;

    }

    return result;

}
// CHÈN KÝ TỰ GÂY NHIỄU
function noiseEncrypt(text){

    const noise="XYZ123";

    let result="";

    for(const ch of normalizeCipherText(text)){

        result+=ch;

        if(ch!==" " && Math.random()<0.28){

            result+=noise[
                Math.floor(Math.random()*noise.length)
            ];

        }

    }

    return result;

}
// UPDATE ENCRYPT
function encryptAnswer(answer,type){

    switch(type){

        case "Caesar":
            return caesarEncrypt(answer,3);

        case "Morse":
            return morseEncrypt(answer);

        case "Skip":
            return skipEncrypt(answer);

        case "Reverse":
            return reverseEncrypt(answer);

        case "RailFence":
            return railFenceEncrypt(answer,3);

        case "Atbash":
            return atbashEncrypt(answer);

        case "Mirror":
            return mirrorEncrypt(answer);

        case "Vigenere":
            return vigenereEncrypt(answer);

        case "Noise":
            return noiseEncrypt(answer);

        case "Zigzag":
            return zigzagEncrypt(answer);

        default:
            return answer;

    }

}
// TĂNG ĐỘ KHÓ
function encryptByDifficulty(answer,type,difficulty){

    if(type==="Caesar"){

        const shift={

            easy:2,

            medium:4,

            hard:6,

            extreme:9

        };

        return caesarEncrypt(answer,shift[difficulty]);

    }

    if(type==="RailFence"){

        const rails={

            easy:2,

            medium:3,

            hard:4,

            extreme:5

        };

        return railFenceEncrypt(answer,rails[difficulty]);

    }

    return encryptAnswer(answer,type);

}
// NHẢY CÓC 
function skipEncrypt(text){

text=normalizeCipherText(text);

let even="";
let odd="";

for(let i=0;i<text.length;i++){

if(text[i]==" ") continue;

if(i%2==0)
even+=text[i];

else
odd+=text[i];

}

return even+" | "+odd;

}
// CIPER LIST
const CIPHER_TYPES=[

"Caesar",

"Morse",

"Skip",

"Reverse",

"RailFence",

"Atbash",

"Mirror",

"Vigenere",

"Zigzag",

"Noise"

];
// RANDOM CIPER
function randomCipher(){

return CIPHER_TYPES[
Math.floor(
Math.random()*CIPHER_TYPES.length
)
];

}


const MORSE_TABLE = {

A:".-",
B:"-...",
C:"-.-.",
D:"-..",
E:".",
F:"..-.",
G:"--.",
H:"....",
I:"..",
J:".---",
K:"-.-",
L:".-..",
M:"--",
N:"-.",
O:"---",
P:".--.",
Q:"--.-",
R:".-.",
S:"...",
T:"-",
U:"..-",
V:"...-",
W:".--",
X:"-..-",
Y:"-.--",
Z:"--.."

};

// PUZZLE
function createPuzzle(answer, difficulty, index){

    const type = randomCipher();

    return {

        id: "cipher_" + index,

        answer,

        difficulty,

        type,

        keyCoords: type,

        cipherCoords: encryptByDifficulty(
            answer,
            type,
            difficulty
        ),

        hint: buildHint(type),

        extraHint:
            "Bạch văn gồm " +
            normalizeAnswer(answer).split(" ").length +
            " từ."

    };

}
// ĐẢO TOÀN CHUỖI
function mirrorEncrypt(text){

    return normalizeCipherText(text)
        .split("")
        .reverse()
        .join("");

}
// ĐỌC XOẮN 2 ĐẦU
function zigzagEncrypt(text){

    text=normalizeCipherText(text).replace(/ /g,"");

    let left=0;
    let right=text.length-1;

    let out="";

    while(left<=right){

        out+=text[left];

        if(left!==right)
            out+=text[right];

        left++;
        right--;

    }

    return out;

}
// UPDATE HINT
function buildHint(type){

    switch(type){

        case "Caesar":
            return "Dịch bảng chữ cái.";

        case "Morse":
            return "Mã Morse quốc tế.";

        case "Skip":
            return "Ghép ký tự xen kẽ.";

        case "Reverse":
            return "Đảo từng từ.";

        case "RailFence":
            return "Đọc theo đường zigzag.";

        case "Atbash":
            return "A↔Z, B↔Y.";

        case "Mirror":
            return "Đọc ngược toàn bộ.";

        case "Vigenere":
            return "Khóa bí mật: GOSPEL.";

        case "Noise":
            return "Có ký tự gây nhiễu.";

        case "Zigzag":
            return "Đọc hai đầu.";

        default:
            return "";

    }

}
const state = {
  levelIndex: 0,
  score: 0,
  secondsLeft: 0,
  timerId: null,
  started: false,
  morseUnlocked: false,
  barrier: null,
  currentPuzzle: null,
  solvedPuzzleIds: new Set(),
  seenPuzzleIds: new Set(),
  resets: 0,
  totalItemsBought: 0,
  runStartedAt: 0,
  wrongStreak: 0,
  firstFiveClean: true,
  expertUsed: false,
  fireworksId: null
};

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const guideModal = document.getElementById("guideModal");
const shopModal = document.getElementById("shopModal");
const startBtn = document.getElementById("startBtn");
const guideBtn = document.getElementById("guideBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");
const closeShopBtn = document.getElementById("closeShopBtn");
const submitBtn = document.getElementById("submitBtn");
const answerInput = document.getElementById("answerInput");
const message = document.getElementById("message");
const shopFab = document.getElementById("shopFab");
const morseTool = document.getElementById("morseTool");
const morseInput = document.getElementById("morseInput");
const morseResult = document.getElementById("morseResult");
const barrierText = document.getElementById("barrierText");
const scratchCanvas = document.getElementById("scratchCanvas");
const scratchNote = document.getElementById("scratchNote");
const puzzlePanel = document.getElementById("puzzlePanel");
const shareBtn = document.getElementById("shareBtn");
const restartBtn = document.getElementById("restartBtn");

function normalizeAnswer(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
function normalizeCipherText(text) {
  return normalizeAnswer(text)
    .toUpperCase();
}
function makeParticles() {
  const holder = document.getElementById("particles");
  const count = window.innerWidth < 720 ? 24 : 42;
  holder.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    const size = 16 + Math.random() * 64;
    dot.className = "particle";
    dot.style.setProperty("--x", `${Math.random() * 100}%`);
    dot.style.setProperty("--y", `${Math.random() * 34}%`);
    dot.style.setProperty("--s", `${size}px`);
    dot.style.setProperty("--a", `${0.14 + Math.random() * 0.45}`);
    dot.style.setProperty("--b", `${Math.random() * 3}px`);
    dot.style.setProperty("--d", `${4 + Math.random() * 6}s`);
    dot.style.animationDelay = `${Math.random() * -6}s`;
    holder.appendChild(dot);
  }
}

function rewardFor(levelNumber) {
  return levelNumber <= 10 ? 10 : (levelNumber - 9) * 10;
}

function baseDuration(levelNumber) {
  const first = 30 * 60;
  const last = 5 * 60;
  const step = (first - last) / 19;
  return Math.round(first - step * (levelNumber - 1));
}

function difficultyFor(levelNumber) {
  if (levelNumber <= 5) return "easy";
  if (levelNumber <= 10) return "medium";
  if (levelNumber <= 15) return "hard";
  return "extreme";
}

function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function switchScreen(from, to) {
  [menuScreen, gameScreen, endScreen].forEach((screen) => screen.classList.remove("active"));
  if (from) from.classList.remove("active");
  setTimeout(() => to.classList.add("active"), 120);
}

function pickPuzzle(levelNumber) {
  const difficulty = difficultyFor(levelNumber);
  const pool = NEW_TESTAMENT_EVENTS
.filter(item => item[1] === difficulty)
.map((item,index)=>
    createPuzzle(
        item[0],
        item[1],
        index
    )
);
  const fresh = pool.filter((puzzle) => !state.seenPuzzleIds.has(puzzle.id));
  const candidates = fresh.length ? fresh : pool.filter((puzzle) => !state.solvedPuzzleIds.has(puzzle.id));
  const list = candidates.length ? candidates : pool;
  const puzzle = list[Math.floor(Math.random() * list.length)];
  state.seenPuzzleIds.add(puzzle.id);
  return puzzle;
}

function rollBarrier(levelNumber) {
  if (levelNumber < 10) return null;
  const roll = Math.random();
  if (roll < 0.16) return "lockShop";
  if (roll < 0.31) return "rushHour";
  if (roll < 0.48) return "lossFaith";
  if (roll < 0.66) return "fog";
  return null;
}

function startGame() {
  clearInterval(state.timerId);
  state.levelIndex = 0;
  state.score = 0;
  state.started = true;
  state.morseUnlocked = false;
  state.solvedPuzzleIds = new Set();
  state.seenPuzzleIds = new Set();
  state.resets = 0;
  state.totalItemsBought = 0;
  state.runStartedAt = Date.now();
  state.wrongStreak = 0;
  state.firstFiveClean = true;
  state.expertUsed = false;
  answerInput.disabled = false;
  submitBtn.disabled = false;
  stopFireworks();
  switchScreen(menuScreen, gameScreen);
  loadLevel();
}

function loadLevel(keepPuzzle = false) {
  clearInterval(state.timerId);
  const levelNumber = state.levelIndex + 1;
  state.currentPuzzle = keepPuzzle && state.currentPuzzle ? state.currentPuzzle : pickPuzzle(levelNumber);
  state.barrier = rollBarrier(levelNumber);
  state.secondsLeft = baseDuration(levelNumber);
  if (state.barrier === "rushHour") state.secondsLeft = Math.max(60, Math.floor(state.secondsLeft / 2));

  document.getElementById("roundText").textContent = `${levelNumber}/20`;
  document.getElementById("scoreText").textContent = state.score;
  document.getElementById("resetText").textContent = state.resets;
  document.getElementById("levelTitle").textContent = `Mật thư ${levelNumber}`;
  document.getElementById("typeTag").textContent = state.currentPuzzle.type;
  document.getElementById("difficultyTag").textContent = DIFFICULTY_LABELS[state.currentPuzzle.difficulty];
  document.getElementById("rewardTag").textContent = `+${rewardFor(levelNumber)} điểm`;
  document.getElementById("keyText").textContent = state.currentPuzzle.keyCoords;
  document.getElementById("cipherText").textContent = state.currentPuzzle.cipherCoords;
  document.getElementById("hintText").textContent = state.currentPuzzle.hint;
  answerInput.value = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  message.className = "message";
  message.textContent = "Suy nghĩ, hướng về Chúa và tìm ra con đường của Ngài.";

  renderBarrier();
  renderShopState();
  renderMorseTool();
  resetScratch();
  if (state.barrier === "fog") setupScratch();
  tick();
  state.timerId = setInterval(() => {
    state.secondsLeft -= 1;
    tick();
    if (state.secondsLeft <= 0) failRun("Hết giờ. Đi lại hành trình .");
  }, 1000);
  setTimeout(() => answerInput.focus(), 150);
}

function renderBarrier() {
  const labels = {
    lockShop: " Khóa kỹ năng. Cửa Hàng bị khóa trong màn này.",
    rushHour: " Giờ cao điểm. Thời gian màn này bị rút ngắn còn một nửa.",
    lossFaith: " Mất Lòng Tin. Nếu sai, bạn bị lùi 2-3 màn và trừ điểm nặng.",
    fog: " Lu Mờ. Hãy cào lớp phủ đen trên đề bài để đọc mật thư."
  };
  barrierText.className = "barrier";
  barrierText.textContent = "";
  if (state.barrier) {
    barrierText.textContent = labels[state.barrier];
    barrierText.classList.add("visible");
  }
}

function renderShopState() {
  const levelNumber = state.levelIndex + 1;
  const unlocked = levelNumber > 3;
  shopFab.classList.toggle("visible", state.started && unlocked);
  shopFab.classList.toggle("locked", state.barrier === "lockShop");
  document.getElementById("shopScore").textContent = state.score;
  document.querySelectorAll("[data-buy]").forEach((button) => {
    const kind = button.dataset.buy;
    const cost = itemCost(kind);
    button.disabled = state.score < cost || state.barrier === "lockShop" || !canBuy(kind);
  });
}

function itemCost(kind) {
  return { time: 15, hint: 20, morse: 25, lucky: 100, expert: 300 }[kind];
}

function canBuy(kind) {
  const levelNumber = state.levelIndex + 1;
  if (kind === "lucky") return levelNumber > 3;
  if (kind === "expert") return levelNumber >= 10 && state.firstFiveClean && !state.expertUsed;
  return true;
}

function renderMorseTool() {
  morseTool.classList.toggle("visible", state.morseUnlocked);
}

function tick() {
  document.getElementById("timerText").textContent = formatTime(Math.max(0, state.secondsLeft));
  document.getElementById("timerCard").classList.toggle("danger", state.secondsLeft <= 60);
}

function submitAnswer() {
  const given = normalizeAnswer(answerInput.value);
  const expected = normalizeAnswer(state.currentPuzzle.answer);
  if (!given) {
    message.className = "message bad";
    message.textContent = "Bạn cần nhập đáp án trước khi nộp.";
    return;
  }
  if (given !== expected) {
    handleWrongAnswer();
    return;
  }
  completeLevel();
}

function completeLevel() {
  const levelNumber = state.levelIndex + 1;
  state.wrongStreak = 0;
  state.solvedPuzzleIds.add(state.currentPuzzle.id);
  state.score += rewardFor(levelNumber);
  document.getElementById("scoreText").textContent = state.score;
  message.className = "message ok";
  message.textContent = `Chính xác: ${state.currentPuzzle.answer}. Bạn nhận ${rewardFor(levelNumber)} điểm.`;
  submitBtn.disabled = true;
  answerInput.disabled = true;
  setTimeout(() => {
    if (state.levelIndex === 19) {
      winGame();
    } else {
      state.levelIndex += 1;
      loadLevel();
    }
  }, 950);
}

function handleWrongAnswer() {
  state.wrongStreak += 1;
  if (state.levelIndex < 5) state.firstFiveClean = false;
  if (state.barrier === "lossFaith") {
    clearInterval(state.timerId);
    const back = 2 + Math.floor(Math.random() * 2);
    state.levelIndex = Math.max(0, state.levelIndex - back);
    state.score = Math.max(0, state.score - 180);
    message.className = "message bad";
    message.textContent = `Mất Lòng Tin: bạn bị lùi ${back} màn và trừ 180 điểm.`;
    setTimeout(() => loadLevel(), 1500);
    return;
  }
  failRun("Sai đáp án. Tiến trình và điểm số đã trở về Màn 1.");
}

function failRun(reason) {
  clearInterval(state.timerId);
  state.resets += 1;
  state.levelIndex = 0;
  state.score = 0;
  state.morseUnlocked = false;
  state.currentPuzzle = null;
  document.getElementById("resetText").textContent = state.resets;
  message.className = "message bad";
  message.textContent = reason;
  submitBtn.disabled = true;
  answerInput.disabled = true;
  setTimeout(() => loadLevel(), 1700);
}

function buyItem(kind) {
  const cost = itemCost(kind);
  if (state.barrier === "lockShop" || state.score < cost || !canBuy(kind)) return;
  state.score -= cost;
  state.totalItemsBought += 1;
  if (kind === "time") {
    state.secondsLeft += 60;
    showShopMessage("Bạn đã cộng thêm 60 giây cho màn hiện tại.");
  }
  if (kind === "hint") showShopMessage(state.currentPuzzle.extraHint);
  if (kind === "morse") {
    state.morseUnlocked = true;
    showShopMessage("Máy Morse đã sẵn sàng ở khung giải đố.");
  }
  if (kind === "expert") {
    state.expertUsed = true;
    answerInput.value = state.currentPuzzle.answer;
    showShopMessage("Anh Huy đã giải xong mật thư. Bạn được vượt qua màn này ngay.");
    shopModal.classList.remove("show");
    setTimeout(() => completeLevel(), 650);
  }
  if (kind === "lucky") useLuckyBox();
  document.getElementById("scoreText").textContent = state.score;
  renderShopState();
  renderMorseTool();
}

function showShopMessage(text) {
  message.className = "message ok";
  message.textContent = text;
}

function useLuckyBox() {
  if (Math.random() < 0.35) {
    const jump = Math.min(19, state.levelIndex + 2);
    state.levelIndex = jump;
    showShopMessage("Hộp Quà May Mắn: hên rồi! Bạn nhảy vọt thêm 2 màn.");
  } else {
    state.score = Math.max(0, state.score - 150);
    state.levelIndex = Math.max(0, state.levelIndex - 2);
    message.className = "message bad";
    message.textContent = "Hộp Quà May Mắn: xui rồi! Bạn lùi 2 màn và mất thêm 150 điểm.";
  }
  shopModal.classList.remove("show");
  setTimeout(() => loadLevel(), 900);
}

function setupScratch() {
  const rect = puzzlePanel.getBoundingClientRect();
  const topOffset = 74;
  scratchCanvas.width = Math.max(320, Math.floor(rect.width - 44));
  scratchCanvas.height = Math.max(220, Math.floor(rect.height - topOffset - 22));
  const ctx = scratchCanvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
  ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "900 22px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.fillText("CÀO ĐỂ MỞ MẬT THƯ", scratchCanvas.width / 2, scratchCanvas.height / 2);
  scratchCanvas.classList.add("active");
  scratchNote.classList.add("active");
}

function resetScratch() {
  scratchCanvas.classList.remove("active");
  scratchNote.classList.remove("active");
}

function scratchAt(event) {
  if (!scratchCanvas.classList.contains("active")) return;
  event.preventDefault();
  const rect = scratchCanvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = (point.clientX - rect.left) * (scratchCanvas.width / rect.width);
  const y = (point.clientY - rect.top) * (scratchCanvas.height / rect.height);
  const ctx = scratchCanvas.getContext("2d");
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 34, 0, Math.PI * 2);
  ctx.fill();
  checkScratchProgress(ctx);
}

function checkScratchProgress(ctx) {
  const data = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clear = 0;
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 40) clear += 1;
  }
  if (clear / (data.length / 16) > 0.42) resetScratch();
}

function winGame() {
  clearInterval(state.timerId);
  shopFab.classList.remove("visible");
  document.getElementById("finalScore").textContent = state.score;
  document.getElementById("finalResets").textContent = state.resets;
  document.getElementById("finalTime").textContent = formatTime(Math.floor((Date.now() - state.runStartedAt) / 1000));
  document.getElementById("finalItems").textContent = state.totalItemsBought;
  switchScreen(gameScreen, endScreen);
  startFireworks();
}

function startFireworks() {
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");
  const sparks = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  for (let i = 0; i < 90; i++) {
    sparks.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      life: 50 + Math.random() * 60,
      color: `hsl(${Math.random() * 360}, 90%, 62%)`
    });
  }
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.015;
      spark.life -= 1;
      if (spark.life <= 0) {
        spark.x = Math.random() * canvas.width;
        spark.y = Math.random() * canvas.height * 0.45;
        spark.life = 50 + Math.random() * 60;
      }
      ctx.fillStyle = spark.color;
      ctx.globalAlpha = Math.max(0.15, spark.life / 100);
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    state.fireworksId = requestAnimationFrame(animate);
  };
  window.addEventListener("resize", resize, { once: true });
  animate();
}

function stopFireworks() {
  if (state.fireworksId) cancelAnimationFrame(state.fireworksId);
  state.fireworksId = null;
}

function shareScore() {
  const text = `Mình đã hoàn tất Hành Trình Chứng Nhân V2 với ${state.score} điểm, ${state.resets} lần reset!`;
  if (navigator.share) {
    navigator.share({ title: "Hành Trình Chứng Nhân V2", text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text);
    alert("Đã sao chép thành tích vào clipboard!");
  }
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
shareBtn.addEventListener("click", shareScore);
guideBtn.addEventListener("click", () => guideModal.classList.add("show"));
closeGuideBtn.addEventListener("click", () => guideModal.classList.remove("show"));
closeShopBtn.addEventListener("click", () => shopModal.classList.remove("show"));
submitBtn.addEventListener("click", submitAnswer);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitAnswer();
});
shopFab.addEventListener("click", () => {
  if (state.barrier === "lockShop") {
    message.className = "message bad";
    message.textContent = "Cạm bẫy đang khóa Cửa Hàng trong màn này.";
    return;
  }
  renderShopState();
  shopModal.classList.add("show");
});
document.querySelectorAll("[data-buy]").forEach((button) => {
  button.addEventListener("click", () => buyItem(button.dataset.buy));
});
[guideModal, shopModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("show");
  });
});
morseInput.addEventListener("input", () => {
  const code = morseInput.value.trim().replace(/\s+/g, "");
  morseResult.textContent = MORSE[code] || "?";
});

let scratching = false;
scratchCanvas.addEventListener("mousedown", (event) => { scratching = true; scratchAt(event); });
scratchCanvas.addEventListener("mousemove", (event) => { if (scratching) scratchAt(event); });
window.addEventListener("mouseup", () => { scratching = false; });
scratchCanvas.addEventListener("touchstart", (event) => { scratching = true; scratchAt(event); }, { passive: false });
scratchCanvas.addEventListener("touchmove", (event) => { if (scratching) scratchAt(event); }, { passive: false });
window.addEventListener("touchend", () => { scratching = false; });

makeParticles();
window.addEventListener("resize", makeParticles);
