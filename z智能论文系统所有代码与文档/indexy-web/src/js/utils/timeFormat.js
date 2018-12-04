// 后台传过来的是UTC时间
// 2017-03-09T02:40:48.000Z =>UTC时间戳=>当地时间戳=>2017-03-09 02:40:48
//传回后台的是UTC时间
//2017-03-09 02:40:48=>当地时间戳=>UTC时间戳=>2017-03-09T02:40:48.000Z

//type 分为 'utc'和'localTime' 根据传回来的类型 将其转换为另一种时间格式

function formatTime(unformatedTime,type) {
 if (!unformatedTime || unformatedTime.indexOf('T') == -1) return ''

 let localDate = new Date(),
     timeLag = localDate.getTimezoneOffset()*60000

  function add0(m){
    return m<10 ? '0'+m : m
  }
  if(!type || type==='utc'){
    //判断是否utc时间 若是 则返回当地时间
    // let localDate = new Date(),
    //     timeLag = localDate.getTimezoneOffset()*60000, //获取当前地区与UTC时区的时差
    let timeArray = unformatedTime.split('T'),
        day = timeArray[0],
        time = timeArray[1].split('.')[0],
        UTCDate = day + ' ' + time,
        UTCStamp = new Date(UTCDate.replace(/-/g, '/')).getTime(),
        localTime = new Date(UTCStamp - timeLag),
        y = localTime.getFullYear(),
        m = localTime.getMonth()+1,
        d = localTime.getDate(),
        h = localTime.getHours(),
        mm = localTime.getMinutes(),
        s = localTime.getSeconds(),
        currentTime = y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)

    return currentTime
  }
  else if(type==='localTime'){
    
    //若不是utc时间 则传回来的是当地时间 需要转换为utc时间
   //2017-03-09 02:40:48=>当地时间戳=>UTC时间戳=>2017-03-09T02:40:48.000Z
    let localTime= new Date(unformatedTime.replace(/-/g, '/')),
        localStamp = localTime.getTime(),
        utcTime = new Date(localStamp + timeLag),
        y = utcTime.getFullYear(),
        m = utcTime.getMonth()+1,
        d = utcTime.getDate(),
        h = utcTime.getHours(),
        mm = utcTime.getMinutes(),
        s = utcTime.getSeconds(),
        ms = utcTime.getMilliseconds(),
        currentTime =  y+'-'+add0(m)+'-'+add0(d)+'T'+add0(h)+':'+add0(mm)+':'+add0(s)+'.'+add0(add0(ms))+'Z'
        return currentTime
  }
}

export {formatTime}
