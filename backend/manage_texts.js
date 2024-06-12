const { v4: uuidv4} = require("uuid")

class ContentManager{
    constructor(db){
        this.db = db;
        this.contents = [];
    }

    async initialize(){
        try {
            await this.checkAndCreateTable();
            await this.initContents()
            console.log("Data is successfully pulled from DB");
        } catch (err) {
            console.error("Data Initializing Error:", err);
            throw err;
        };
    }

    //コンテンツの初期化
    async initContents(){
        const query = 'SELECT id, text, registration_date FROM texts';
        
        return new Promise((resolve, reject)=>{
            this.db.query(query, (err, results) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }else{
                    this.contents = results
                    resolve();
                }
        })});
    
    }
    
    // textsテーブルが存在するかを確認し，なければ作る
    async checkAndCreateTable() {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS texts (
            id VARCHAR(255) NOT NULL PRIMARY KEY,
            text TEXT,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    
        return new Promise((resolve, reject) => {
            this.db.query(createTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating table:', err);
                    reject(err);
                } else {
                    console.log('Table created or already exists');
                    resolve();
                }
            });
        });
    }

    async addContent(text){
        try {
            const id = await this.generateUniqueId();
            console.log('Id Generated Successfully:', id);
            // ここでデータベースにテキストとIDを保存する処理を追加
            const insertQuery = 'INSERT INTO texts (id, text) VALUES (?, ?)';
            await new Promise((resolve, reject) => {
                this.db.query(insertQuery, [id, text], (err, result) => {
                    if (err) {
                        console.error("Failed to add content:", err);
                        reject(err);
                    } else {
                        console.log("Content added successfully");
                        resolve();
                    }
                });
            });
        }catch (err) {
            console.error("Id Generation Failed:", err);
            throw err;
        }
    }

    /* 
    ユニークなIdを作成
    */
    async generateUniqueId(){
        const tryGenerateId = async () => {
            let id;
            do {
                id = uuidv4();
            }while (await this.checkIdExists(id).then(() => {
                console.log("Successfully checked new id exists or not");
            }).catch(err => {
                console.error("Failed to check new id exists");
            }));
            return id;
        };

        return tryGenerateId();
    }

    /* 
    データベースに同じIdを持つ
    要素が存在するかを確認
    */
    checkIdExists(id){
        const query = 'SELECT COUNT(*) AS count FROM texts WHERE id = ?';
        
        return new Promise((resolve, reject)=> {
            this.db.query(query, [id], (err, results)=> {
                if (err){
                    console.error(err);
                    //エラー発生時の関数
                    reject(err);
                }else{
                    //正常に動いた時の返り値
                    resolve(results[0].count > 0);
                }
            });
        });

    }

    async getTable(){
        try {
            await this.initContents();
            console.log("Successfully get table from DB")
            return this.contents;
        } catch (err) {
            console.error("Failed to get table from DB", err);
            throw err;
        }   
    
    }


    async deleteRow(id){
        const query = 'DELETE FROM texts WHERE id = ?';
        return new Promise((resolve, reject)=> {
            this.db.query(query, [id], (err, result) => {
                if (err) {
                    console.error("Failed to delete item");
                    reject("Failed to delete item");
                } else {
                    if (result.affectedRows === 0){
                        console.log("No item found with id:", id);
                        resolve("No item found"); // 存在しなかった場合のメッセージ
                    } else {
                        console.log("Successfully deleted item id:", id);
                        resolve("Successfully deleted");
                    }
                }
            }); 
        })
    }

}

module.exports = ContentManager;