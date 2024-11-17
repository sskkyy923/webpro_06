const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

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
  let win = Number(req.query.win) || 0; 
  let total = Number(req.query.total) || 0; 

  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  let judgement = '引き分け';
  if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1; // 勝ち数を増やす
  } else if (
    (hand === 'グー' && cpu === 'パー') ||
    (hand === 'チョキ' && cpu === 'グー') ||
    (hand === 'パー' && cpu === 'チョキ')
  ) {
    judgement = '負け';
  }
  total += 1; // 試合数を増やす
 
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/quiz", (req, res) => {
  let answer = req.query.answer; // ユーザーの回答
  let correct = Number(req.query.correct) || 0; // 正解数の初期化または取得
  let total = Number(req.query.total) || 0; // 回答数の初期化または取得

  // クイズ問題を定義（例: 正しい答えが "2" とする）
  const question = "世界で一番高い山は？";
  const choices = ["富士山", "キリマンジャロ", "エベレスト"];
  const correctAnswer = "エベレスト"; // 正解の答え

  // ユーザーが回答している場合のみ処理
  if (answer) {
    total += 1; // 回答数を増やす
    if (answer === correctAnswer) {
      correct += 1; // 正解数を増やす
    }
  }

  // 表示する結果をオブジェクトに格納
  const display = {
    question: question,
    choices: choices,
    correctAnswer: correctAnswer,
    userAnswer: answer,
    correct: correct,
    total: total,
    isCorrect: answer === correctAnswer
  };

  res.render("quiz", display);
});

app.get("/calculator", (req, res) => {
  const num1 = Number(req.query.num1) || 0;
  const num2 = Number(req.query.num2) || 0;
  const operator = req.query.operator || "+";
  let result;

  switch (operator) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      result = num2 !== 0 ? num1 / num2 : "エラー (ゼロ除算)";
      break;
    default:
      result = "無効な演算子";
  }

  res.render("calculator", { num1, num2, operator, result });
});



app.listen(8080, () => console.log("Example app listening on port 8080!"));
