function parse_dates(dates){
    let months = [[],[],[],[],[],[],[],[],[],[],[],[]];
    
    for(var i = 0; i < dates.length; i++ ){
        let month = dates[i].birthday.split("/")[1]
        months[parseInt(month)-1].push(dates[i])
    }
    for(var i = 0; i < 12; i++ ){
        months[i].sort((a, b) => a.birthday.split("/")[0] - b.birthday.split("/")[0])
    }

    return months
}

module.exports =  {
    parse_dates,
}