// ============================================================
//  勉強会(2)  傾きで玉を動かす
// ============================================================
//
//  このファイルにコードを書いていく。上から順に進める。
//
//
//  用意されている関数と定数
//
//    tilt.x          端末の左右の傾き  -1 〜 1（右に倒すと +）
//    tilt.y          端末の前後の傾き  -1 〜 1（手前に倒すと +）
//    drawBall(x, y)  指定した座標に玉を描く
//    BOARD_W         盤の幅   300
//    BOARD_H         盤の高さ 400
//
//  座標系は左上が (0, 0)、右下が (BOARD_W, BOARD_H)。
//  y は下向きが正。数学のグラフとは上下が逆なので注意。
//
//
//  実行
//    保存 → ブラウザを再読み込み。端末がなければ矢印キーで傾く。
//    エラーは画面下部に表示される。
//
// ============================================================




// ============================================================
//  STEP 0 - 4 は解説しながら一緒に進める
// ============================================================


// ------------------------------------------------------------
//  STEP 0   このファイルを index.html から読み込む
// ------------------------------------------------------------
//  前回作った index.html の </body> の直前に、次の3行を足す。
//
//      <script src="three.min.js"></script>
//      <script src="engine.js"></script>
//      <script src="game.js"></script>
//
//  script タグは外部の JavaScript ファイルを読み込むタグ。
//  上から順に読み込まれるので、この順番を入れ替えてはいけない。
//  engine.js は three.min.js を使い、game.js は engine.js を使うため。
//
//  確認: 盤が木目の3D表示に変わる。
//        画面の下に「update() が見つかりません」と赤く出れば正常。
//        STEP 2 でその update() を書くと消える。


// ------------------------------------------------------------
//  STEP 1   玉の状態を持つ
// ------------------------------------------------------------
//  位置と速度を1つのオブジェクトにまとめる。
//
//      let ball = { x: 150, y: 200, vx: 0, vy: 0 };

let ball = {
    x: 150,
    y: 200,
    vx: 0,
    vy: 0
};

let initialBallX = 150;
let initialBallY = 200;

let xwall = 240;
let xwall2 = 220;
let xwall3 = 260;

let xgoal = 30;
let ygoal = 20;
let rgoal = 10;

let speed = 1.0;
let speed2 = 1.4;
let speed3 = 1.6;

let gxspeed = 1.0;
let gyspeed = 0.0;

let sec = 0.0;

let normalBest = 0;
let hardBest = 0;

let cleared = false;
let hardMode = false;


// 固定壁
let walls = [
    { x: 0,   y: 100, w: 200, h: 30 },
    { x: 200, y: 100, w: 30,  h: 150 },
    { x: 100, y: 250, w: 130, h: 30 },
    { x: 100, y: 165, w: 30,  h: 100 },
    { x: 170, y: 50,  w: 80,  h: 5 },
    { x: 145, y: 75,  w: 8,  h: 8 },
    { x: 145, y: 25,  w: 8,  h: 8 },
    { x: 110, y: 77,  w: 4,  h: 4 },
    { x: 110, y: 27,  w: 4,  h: 4 },
    { x: 50,  y: 50,  w: 80,  h: 5 },
    { x: 40,  y: 200, w: 60,  h: 10 },
    { x: 40,  y: 320, w: 85,  h: 5 },
    { x: 250,  y: 320, w: 85,  h: 5 },
    { x: 0,   y: 260, w: 60,  h: 10 },
    { x: 120, y: 260, w: 5,  h: 70 },
    { x: 120, y: 360, w: 5,  h: 40 },
    { x: 160, y: 260, w: 5,  h: 40 },
    { x: 160, y: 330, w: 5,  h: 70 },
    { x: 220, y: 280, w: 5,  h: 50 },
    { x: 220, y: 350, w: 5,  h: 55 }
    
];


// ==========================================
// NORMAL開始
// ==========================================

function startNormal() {

    hardMode = false;

    document.getElementById("modeSelect").style.display = "none";
    document.getElementById("game").style.display = "block";

    document.getElementById("modeChangeBtn").textContent =
        "ハードモード";

}


// ==========================================
// NORMALボタン
// ==========================================

document.getElementById("normalBtn").addEventListener(
    "click",
    startNormal
);


// ==========================================
// HARDボタン
// ==========================================

document.getElementById("hardBtn").addEventListener(
    "click",
    function() {

        hardMode = true;

        document.getElementById("modeSelect").style.display = "none";
        document.getElementById("game").style.display = "block";

        document.getElementById("modeChangeBtn").textContent =
            "ノーマルモード";

    }
);


// ==========================================
// RESETボタン
// ==========================================

document.getElementById("resetBtn").addEventListener(
    "click",
    function() {

        // ボールを初期位置に戻す
        ball.x = initialBallX;
        ball.y = initialBallY;

        // ボールの速度を0にする
        ball.vx = 0;
        ball.vy = 0;

        // タイマーを0にする
        sec = 0.0;

        // CLEARを解除
        cleared = false;

        // タイマー表示
        document.getElementById("timer").textContent =
            "00.0";

        // CLEAR表示を消す
        document.getElementById("message").textContent = "";

       
       
    }
);


// ==========================================
// モード切替ボタン
// ==========================================

document.getElementById("modeChangeBtn").addEventListener(
    "click",
    function() {

        if (hardMode == false) {

            // NORMAL → HARD
            hardMode = true;

            document.getElementById("modeChangeBtn").textContent =
                "ノーマルモード";

        }
        else {

            // HARD → NORMAL
            hardMode = false;

            document.getElementById("modeChangeBtn").textContent =
                "ハードモード";

        }


        // ボールを初期位置に戻す
        ball.x = initialBallX;
        ball.y = initialBallY;

        ball.vx = 0;
        ball.vy = 0;


        // TIMEを0にする
        sec = 0.0;

        // CLEARを解除
        cleared = false;

        document.getElementById("timer").textContent =
            "00.0";

        document.getElementById("message").textContent = "";

    }
);


// ==========================================
// update
// ==========================================

function update() {

    // ゴールとの距離
    let dx = ball.x - xgoal;
    let dy = ball.y - ygoal;

    let dist = Math.sqrt(dx * dx + dy * dy);


    // --------------------------------------
    // 固定壁を描画
    // --------------------------------------

    for (let i = 0; i < walls.length; i++) {

        drawWall(
            walls[i].x,
            walls[i].y,
            walls[i].w,
            walls[i].h
        );

    }


    // --------------------------------------
    // 動く壁を描画
    // --------------------------------------

    drawWall(xwall, 260, 40, 5);
    drawWall(xwall2, 200, 40, 5);
    drawWall(xwall3, 140, 40, 5);


    // --------------------------------------
    // ボールとゴールを描画
    // --------------------------------------

    drawBall(ball.x, ball.y);
    drawGoal(xgoal, ygoal, rgoal);


    // --------------------------------------
    // 動く壁
    // --------------------------------------

    xwall = xwall + speed;

    if (xwall < 220) {
        xwall = 220;
        speed = -speed;
    }

    if (xwall > 260) {
        xwall = 260;
        speed = -speed;
    }


    xwall2 = xwall2 + speed2;

    if (xwall2 < 220) {
        xwall2 = 220;
        speed2 = -speed2;
    }

    if (xwall2 > 260) {
        xwall2 = 260;
        speed2 = -speed2;
    }


    xwall3 = xwall3 + speed3;

    if (xwall3 < 220) {
        xwall3 = 220;
        speed3 = -speed3;
    }

    if (xwall3 > 260) {
        xwall3 = 260;
        speed3 = -speed3;
    }


    // --------------------------------------
    // ボール
    // --------------------------------------

    ball.vx = ball.vx * 0.96;
    ball.vy = ball.vy * 0.96;

    ball.vx = ball.vx + tilt.x * 0.2;
    ball.vy = ball.vy + tilt.y * 0.2;


    // --------------------------------------
    // X方向
    // --------------------------------------

    let prevX = ball.x;

    ball.x = ball.x + ball.vx;

    if (hitWall()) {

        if (hardMode) {

            // HARDは初期位置に戻る
            ball.x = initialBallX;
            ball.y = initialBallY;

            ball.vx = 0;
            ball.vy = 0;

        }
        else {

            // NORMALは跳ね返る
            ball.x = prevX;
            ball.vx = -ball.vx * 0.5;

        }

    }


    // --------------------------------------
    // Y方向
    // --------------------------------------

    let prevY = ball.y;

    ball.y = ball.y + ball.vy;

    if (hitWall()) {

        if (hardMode) {

            // HARDは初期位置に戻る
            ball.x = initialBallX;
            ball.y = initialBallY;

            ball.vx = 0;
            ball.vy = 0;

        }
        else {

            // NORMALは跳ね返る
            ball.y = prevY;
            ball.vy = -ball.vy * 0.5;

        }

    }


    // --------------------------------------
    // 画面端
    // --------------------------------------

    // --------------------------------------
// 画面端
// --------------------------------------

if (ball.x < 0) {

    if (hardMode) {

        ball.x = initialBallX;
        ball.y = initialBallY;

        ball.vx = 0;
        ball.vy = 0;

    }
    else {

        ball.x = 0;
        ball.vx = -ball.vx * 0.5;

    }

}

if (ball.x > 300) {

    if (hardMode) {

        ball.x = initialBallX;
        ball.y = initialBallY;

        ball.vx = 0;
        ball.vy = 0;

    }
    else {

        ball.x = 300;
        ball.vx = -ball.vx * 0.5;

    }

}

if (ball.y < 0) {

    if (hardMode) {

        ball.x = initialBallX;
        ball.y = initialBallY;

        ball.vx = 0;
        ball.vy = 0;

    }
    else {

        ball.y = 0;
        ball.vy = -ball.vy * 0.5;

    }

}

if (ball.y > 400) {

    if (hardMode) {

        ball.x = initialBallX;
        ball.y = initialBallY;

        ball.vx = 0;
        ball.vy = 0;

    }
    else {

        ball.y = 400;
        ball.vy = -ball.vy * 0.5;

    }

}


    // --------------------------------------
    // ゴール移動
    // --------------------------------------

    rgoal = rgoal + speed3 * 0.3;

    xgoal = xgoal + gxspeed;
    ygoal = ygoal + gyspeed;


    if (xgoal >= 145 && ygoal == 20) {

        xgoal = 145;

        gxspeed = 0;
        gyspeed = 1.0;

    }


    if (xgoal == 145 && ygoal >= 80) {

        ygoal = 80;

        gxspeed = -1.0;
        gyspeed = 0;

    }


    if (xgoal <= 30 && ygoal == 80) {

        xgoal = 30;

        gxspeed = 0;
        gyspeed = -1.0;

    }


    if (xgoal == 30 && ygoal <= 20) {

        ygoal = 20;

        gxspeed = 1.0;
        gyspeed = 0;

    }


    // --------------------------------------
    // ゴール判定
    // --------------------------------------

    if (dist < rgoal) {

        if (cleared == false) {

            cleared = true;

            if (hardMode == false) {

    if (normalBest == 0 || sec < normalBest) {
        normalBest = sec;
    }

}
else {

    if (hardBest == 0 || sec < hardBest) {
        hardBest = sec;
    }

}
        }

    }


    // --------------------------------------
    // タイマー
    // --------------------------------------

    if (cleared == true) {

        document.getElementById("message").textContent =
            "CLEAR";

    }
    else {

        sec = sec + 1 / 60;

    }


    document.getElementById("timer").textContent =
        sec.toFixed(1).padStart(4, "0");


   document.getElementById("normalBest").textContent =
    "normalBest: " + normalBest.toFixed(1);

document.getElementById("hardBest").textContent =
    "hardBest: " + hardBest.toFixed(1);

}


// ==========================================
// 壁との衝突判定
// ==========================================

function hitWall() {

    // --------------------------------------
    // 固定壁
    // --------------------------------------

    for (let i = 0; i < walls.length; i++) {

        let w = walls[i];

        if (
            ball.x > w.x &&
            ball.x < w.x + w.w &&
            ball.y > w.y &&
            ball.y < w.y + w.h
        ) {

            return true;

        }

    }


    // --------------------------------------
    // 動く壁1
    // --------------------------------------

    if (
        ball.x > xwall &&
        ball.x < xwall + 40 &&
        ball.y > 260 &&
        ball.y < 265
    ) {

        return true;

    }


    // --------------------------------------
    // 動く壁2
    // --------------------------------------

    if (
        ball.x > xwall2 &&
        ball.x < xwall2 + 40 &&
        ball.y > 200 &&
        ball.y < 205
    ) {

        return true;

    }


    // --------------------------------------
    // 動く壁3
    // --------------------------------------

    if (
        ball.x > xwall3 &&
        ball.x < xwall3 + 40 &&
        ball.y > 140 &&
        ball.y < 145
    ) {

        return true;

    }


    return false;

}

    // ------------------------------------------------------------
    //  STEP 3   位置を更新する
    // ------------------------------------------------------------
    //  update() の中、drawBall() より前に1行足す。
    //
    //      ball.x = ball.x + 2;
    //
    //  毎フレーム x が2ずつ増えるので、玉は右へ進む。
    //
    //  確認: 玉が右へ流れ、そのまま画面外へ出ていく。
    //        壁がないので当然こうなる。STEP 5 で閉じ込める。





    // ------------------------------------------------------------
    //  STEP 4   傾きを加速度として扱う
    // ------------------------------------------------------------
    //  STEP 3 で直接書いた 2 を、速度 vx に置き換える。
    //  さらにその前で、傾きを速度に足し込む。
    //
    //      ball.vx = ball.vx + tilt.x * 0.5;
    //      ball.vy = ball.vy + tilt.y * 0.5;
    //
    //      ball.x = ball.x + ball.vx;
    //      ball.y = ball.y + ball.vy;
    //
    //  傾き（加速度）を速度に足し、速度を位置に足している。
    //  高校物理の v = v0 + at, x = x0 + vt を、
    //  t = 1フレーム として離散的に繰り返しているだけ。
    //
    //  だから傾け続けると加速し続ける。一定速度では動かない。
    //
    //  確認: 傾ける（矢印キー）と玉が動き、離しても止まらない。
    //        0.5 は傾きの効き。あとで好きな値にしてよい。





    // ============================================================
    //
    //  ここから先は自力で書く。
    //  コメントは仕様であって、コードではない。
    //
    // ============================================================


    // ------------------------------------------------------------
    //  STEP 5   左の壁
    // ------------------------------------------------------------
    //  update() の中、drawBall() より前に書く。
    //
    //      もし ball.x が 0 より小さければ
    //          ball.x を 0 に戻す
    //          ball.vx の符号を反転する
    //
    //
    //  「もし〜ならば」は if で書く。形はこう。
    //
    //      if (条件) {
    //        条件が成り立ったときにやること
    //      }
    //
    //  例）速度が 100 を超えていたら 100 で頭打ちにする
    //
    //      if (ball.vx > 100) {
    //        ball.vx = 100;
    //      }
    //
    //  比較は   <  小さい    >  大きい
    //  符号の反転は  ball.vx = -ball.vx;
    //
    //  確認: 左へ転がすと壁で跳ね返る。





    // ------------------------------------------------------------
    //  STEP 6   右の壁
    // ------------------------------------------------------------
    //  右端をはみ出したら、押し戻して反射させる。
    //  右端の座標は BOARD_W。
    //
    //  確認: 右でも跳ね返る。





    // ------------------------------------------------------------
    //  STEP 7   上下の壁
    // ------------------------------------------------------------
    //  y と vy、BOARD_H を使う。
    //
    //  確認: 四方で跳ね返り、玉が盤から出られなくなる。





    // ============================================================
    //
    //  ここからは挙動の調整。正解はない。
    //
    // ============================================================


    // ------------------------------------------------------------
    //  STEP 8   反発係数と摩擦
    // ------------------------------------------------------------
    //  現状は速度が保存されるので永久に跳ね返り続ける。
    //  4つの壁すべての反射に反発係数を掛ける。
    //
    //      ball.vx = -ball.vx * 0.5;
    //
    //  さらに、毎フレーム速度を一定割合で減らして摩擦を入れる。
    //  update() の中、位置の更新より前に書く。
    //
    //      ball.vx = ball.vx * 0.98;
    //      ball.vy = ball.vy * 0.98;
    //
    //  確認: 傾きを戻すと玉が減速して止まる。
    //        反発係数を 0.9 / 0.2、摩擦を 0.90 / 1.00 にすると何が起きるか。





    // ============================================================
    //
    //  発展
    //
    //    ・玉には半径10がある。壁にめり込んで見えるのを直す
    //    ・空気抵抗を速度の2乗に比例させる（今は1次）
    //    ・センサー値のノイズが気になる場合、
    //      tilt に移動平均やローパスフィルタをかけて滑らかにする
    //    ・玉を複数にして、玉どうしの衝突を扱う
    //    ・壁ごとに反発係数を変える
    //
    // ============================================================
