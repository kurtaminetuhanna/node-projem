const http=require("http");

const server =http.createServer((req,res)=>
{
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.end("Merhaba Node.js!");
});
server.listen(3000,()=>{
    console.log("Sunucu http://localhost:3000 adresinde çalışıyor");
});
console.log("Node.js projem güncellendi!");
