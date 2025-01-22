const { MongoClient, ServerApiVersion } = require('mongodb');
//const { mongodb_pass, mongodb_user } = require('../config.json');
require('dotenv').config()
const username = encodeURIComponent(process.env.MONGODBUSER);
const password = encodeURIComponent(process.env.MONGODBPASS);
let uri = `mongodb+srv://${username}:${password}@cluster0.2zgae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function save_server(_server_id,_channel_id,_message_id) {
    try {
        await client.connect();
        let servers = await client.db("birthdaybot").collection("servers");
        const server = await servers.findOne({server_id:_server_id})
        const doc  = {server_id:_server_id,message_id:_message_id,channel_id:_channel_id};
        if(!server){
            await servers.insertOne(doc)
        }else{
            await servers.replaceOne({server_id:_server_id},doc)
        }
    }finally{
        await client.close();
    }
}

async function get_server(_server_id){
  var server;
  try {
    await client.connect();
    let servers = client.db("birthdaybot").collection("servers");
    server = await servers.findOne({server_id:_server_id})
}finally{
    await client.close();
    return server
}
}

async function get_birthdays(_server_id){
    let server_birthdays = []
    try {
        await client.connect();
        let birthdays = client.db("birthdaybot").collection("birthdays");

        const  options = {
          projection:{
            user_id:1,
            server_id:1,
            birthday:1,
            username:1,
            _id:0
          }
        }

        const  query = {server_id:_server_id};

        const cursor = birthdays.find(query,options);
        if((await birthdays.countDocuments(query)) === 0){
          console.log("No birthdays found.")
        }
        for await(const document of cursor){
          server_birthdays.push(document);
        }

      } finally {
        await client.close();
        
      }
    return server_birthdays;
}

async function save_birthday(_server_id,_user_id,_username,_birthday){
    try {
        await client.connect();
        let birthdays = await client.db("birthdaybot").collection("birthdays");
        user = await birthdays.findOne({server_id:_server_id,user_id:_user_id});
        let doc = {server_id:_server_id,user_id:_user_id,username:_username,birthday:_birthday,birthdate:_birthday.slice(0,-5)};
        if(!user){
            await birthdays.insertOne(doc);
        }else{
            await birthdays.replaceOne({server_id:_server_id,user_id:_user_id},doc);
        }

      } catch(error){
        console.error(error);
      }finally {
        await client.close();
      }
}

async function delete_birthday(_server_id,_user_id){
  try {
    await client.connect();
    let birthdays = await client.db("birthdaybot").collection("birthdays");
    user = await birthdays.findOne({server_id:_server_id,user_id:_user_id});
    if(!user){
        return false;
    }else{
        await birthdays.deleteOne({server_id:_server_id,user_id:_user_id});
        return true;
    }

  } catch(error){
    console.error(error);
  }finally {
    await client.close();
  }
}

async function get_birthdays_on_day(day) {
  try {
    await client.connect();
    let birthdays = await client.db("birthdaybot").collection("birthdays");

    const  options = {
      projection:{
        user_id:1,
        server_id:1,
        birthday:1,
        username:1,
        _id:0
      }
    }

    const  query = {birthdate:day};

    const cursor = birthdays.find(query,options);
    if((await birthdays.countDocuments(query)) === 0){
      console.log("No birthdays found.")
    }
    var bd = [];
    for await(const document of cursor){
      //server_birthdays.push(document);
      //Save user id and server id on  something and return it
      //console.log(document)
      //bd.set(document.user_id,document.server_id)
      bd.push(`${document.server_id}/${document.user_id}`)
    }

  } finally {
    await client.close();
  }
  return bd;
}


module.exports =  {
    save_server,
    get_birthdays,
    get_birthdays_on_day,
    save_birthday,
    get_server,
    delete_birthday
}

