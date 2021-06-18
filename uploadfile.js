function save_file_on_server(file1,foldername){
    let filename=file1.name;
    var pathoffileupload=foldername+'/'+filename;
    var realpath='public/'+pathoffileupload;
    file1.mv(realpath,function (err){
        if(err){
            res.status(500).send(err);
        }
    })
}
module.exports=save_file_on_server
