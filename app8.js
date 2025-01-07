"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える
let tasks = []; // タスクの配列
let idCounter = 1; // タスクID用のカウンター


app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log( [name, message] );
  // 本来はここでDBMSに保存する
  bbs.push( { name: name, message: message } );
  res.json( {number: bbs.length } );
});

app.get("/bbs", (req,res) => {
    console.log("GET /BBS");
    res.json( {test: "GET /BBS" });
});

app.post("/bbs", (req,res) => {
    console.log("POST /BBS");
    res.json( {test: "POST /BBS"});
})

app.get("/bbs/:id", (req,res) => {
    console.log( "GET /BBS/" + req.params.id );
    res.json( {test: "GET /BBS/" + req.params.id });
});

app.put("/bbs/:id", (req,res) => {
    console.log( "PUT /BBS/" + req.params.id );
    res.json( {test: "PUT /BBS/" + req.params.id });
});

app.delete("/bbs/:id", (req,res) => {
    console.log( "DELETE /BBS/" + req.params.id );
    res.json( {test: "DELETE /BBS/" + req.params.id });
});

// タスク一覧を取得
app.get("/task", (req, res) => {
  console.log("GET /tasks");
  res.json(tasks);
});

// タスクを追加
app.post("/task", (req, res) => {
  console.log("POST /task");
  const { title, content } = req.body; // タスク名と内容を取得
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const newTask = {
    id: idCounter++, // IDを生成
    title,
    content,
    completed: false
  };
  tasks.push(newTask); // タスクを追加
  res.status(201).json(newTask); // 追加したタスクを返す
});



// 特定のタスクを取得
app.get("/task", (req, res) => {
  console.log("GET /task");
  res.json(tasks); // タスク一覧を返す
});


// 特定のタスクを更新（完了状態など）
app.put("/task/:id", (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;  // bodyをJSONとして受け取る
  console.log("PUT /task/" + taskId);
  const task = tasks.find(t => t.id === parseInt(taskId));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  task.completed = completed;  // 完了状態を更新
  res.json(task);  // 更新されたタスクを返す
});

// 特定のタスクを削除
app.delete("/task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  console.log("DELETE /task/" + taskId);
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(index, 1); // タスクを削除

  // タスクが残っている場合はIDを連番にリセット
  if (tasks.length > 0) {
    tasks.sort((a, b) => a.id - b.id); // ID順に並べ替え
    tasks.forEach((task, idx) => {
      task.id = idx + 1; // 1から順番に再設定
    });
  } else {
    // タスクがすべて削除された場合、次のタスクIDを1にリセット
    idCounter = 1;
  }

  res.json({ message: "Task deleted" });
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));
