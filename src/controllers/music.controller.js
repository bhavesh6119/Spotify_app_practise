const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model')
const { uploadFile } = require('../services/storage.service');
const jwt = require("jsonwebtoken");


async function createMusic(req,res){

    const token  =req.cookies.token;

    if(!token){
        res.status(401).json({
            message : "Unauthorized"
        })
    }
    
    let decoded;
    try { 
        decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role!='artist'){
            res.status(403).json({
                message : "You dont have access to create music"
            })
        }
    } catch(err){
        res.status(401).json({
            message : "Unauthorized"
        })
    }

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri : result.url,
        title,
        artist : decoded.id,
    })

    res.status(201).json({
        message : "Music Created successfully",
        music : {
            id : music._id,
            uri : music.uri,
            title : music.title,
            artist : music.artist
        }
    })
}

async function createAlbum(req,res){

    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message : "Unauthorized"
        })
    }

    let decoded;
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(decoded.role!='artist'){
            res.status(403).json({
                message : "You Dont have access to create music"
            })
        }
    }catch (err){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }

    const { title, musicIds } =  req.body;

    const ablum = await albumModel.create({
        title,
        artist : decoded.id,
        musics :  musicIds
    })

    res.status(201).json({
        message : "Album created successfully";
        album :  {
            id : album._id,
            title : album.title,
            artist : album.artist,
            musics :  album.musics
        }
    })
}

module.exports = { createMusic, createAlbum };