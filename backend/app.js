const mysql = require('mysql2')
const express = require('express');
const cors = require('cors');
const app = express();
const ContentManager = require('./manage_texts.js');
/* 
Express.js アプリケーションでミドルウェアとして機能する関数です。
このミドルウェアは、受信する HTTP リクエストのボディが JSON 形式
のデータを含む場合にそれを解析し、req.body としてアクセスできる
ようにする役割を担います。
*/
app.use(express.json())
const port = 5000;
/* 
CORSという特定のオリジン（ポート番号やIP）
からの連絡のみ許可するシステム
*/
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));




// データベース接続設定
// mysql.createConnectionはデフォルトで3306番号に通信する
const db = mysql.createConnection({
  host: 'db', // MySQL サーバーのホスト名
  user: 'root', // MySQL ユーザー名
  password: 'rootpassword', // MySQL パスワード
  database: 'mydatabase' // データベース名
})

// データベース接続
db.connect(err => {
  if (err){
    console.error('Failed to connect to MySQL, retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  } else{
    console.log('Connected to the MySQL server.');
  } 
});


// contentManagerの初期化
const contentManager = new ContentManager(db);
contentManager.initialize()
    .then(() => {
        console.log("Initialization successed!");  // 初期化成功の確認
    })
    .catch(err => {
        console.error("Initialization failed:", err);  // エラー情報のログ
    });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// データ保存
app.post('/save-text', (req, res) => {
  const {text} = req.body;

  contentManager.addContent(text).then( () => {
    console.log("Successfully added new data");
    res.send("Successfully added new data");
  }).catch (err => {
    console.error("Failed to add new data", err);
    res.status(500).json({error: "Failed to add new data."});
  })
});

// データ取得
app.get('/get-texts', (req, res) => {
  contentManager.getTable().then((content)=> {
    console.log("getTable Method has been successfully excuted");
    res.json(content);
  }).catch (err => {
    console.error("Failed to getTable", err);
    res.status(500).json({error: "Failed to get data"});
  });
});

// データをIDで取得
app.get('/get-texts/:id', (req, res)=>{
  const id = req.params.id; // URL パラメータからIDを取得
  const query = 'SELECT * FROM texts WHERE id = ?';
  
  db.query(query, [id], (err, results)=>{
    if(err){
      console.error(err);
      res.status(500).send('Failed to retrieve data');
    } else if (results.length > 0){
      res.json(results[0]); // 結果が存在すればそのデータを返す
    }else {
      res.status(404).send('Data not found'); // 該当データ存在しない
    }
  });
});

// データの削除
app.delete('/delete-text', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM texts WHERE id = ?';

  contentManager.deleteRow(id).then( result => {
    console.log(result);
    res.send(result);
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  });


});

// text = "おはよう！";

// contentManager.addContent(text).then( () => {
//   console.log("Successfully added new data");
// }).catch (err => {
//   console.err("Failed to add new data", err);
//   res.status(500).json({error: "Failed to add new data."});
// })

delid = "1d32c1fd-623d-4194-b5f1-3c287aaefcb8";

contentManager.deleteRow(delid).then( result => {
  console.log(result);
}).catch( err => {
  console.error(err);
})


contentManager.getTable().then((content)=> {
  console.log("getTable Method has been successfully excuted");
  
  console.log(content);
}).catch (err => {
  console.error("Failed to getTable", err);
});