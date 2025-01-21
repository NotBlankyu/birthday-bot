const {get_server,get_birthdays} = require("./db.js")
const {parse_dates} = require("./dates.js")
const fs = require('node:fs');
const path = require('node:path');


async function manage_message(channel){
    let birthdays = await get_birthdays(channel.guildId);
    let months = parse_dates(birthdays);
    let text = fs.readFileSync(path.join(__dirname, "birthday_message.txt")).toString();
    for(let i = 0; i < 12; i++){
        let month_text=""
        
        for(let j = 0; j < months[i].length; j++){
            let date = months[i][j].birthday.split("/");
            let day = date[0];
            let year = date[2]; 
            month_text +=  `❥${day}: ${months[i][j].username} (${year})\n`
        }
        text = text.replace(`{${i}}`,month_text)
    }
    channel.messages.fetch({limit: 100})
    .then(messages => channel.bulkDelete(messages.filter(message =>
         message.author.id === '1327607768739352651'))).then(e => {
    const chunks = text.match(/[\s\S]{1,1000}\)/g) || [];
    chunks.forEach(async chunk => {
        await channel.send(chunk);
    });});
    
}

module.exports = {
    manage_message
}