
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yashi:abcd1234@shop.c0poi.mongodb.net/shopDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});

let _db;

const mongoConnect = (callback)=>{
    client.connect()
        .then(clients =>{
            console.log("connected");
            _db = clients.db();
            callback();
        }).catch(err=>{
        console.log("err",err);
        throw err;
    });
};

const getDb = ()=>{
  if(_db) {
      return _db;
  }
  throw 'No database found';
};

module.exports ={
    mongoConnect:mongoConnect,
    getDb:getDb
}
