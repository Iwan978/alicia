const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, downloadMediaMessage } = require("@adiwajshing/baileys");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const chalk = require("chalk");
const {writeFile} = require('fs').promises;
const FormData = require('form-data');


module.exports = sansekai = async (client, m, chatUpdate, store) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

      const messageType = m.mtype
      
    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    // Group
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    if (m.text && !m.isGroup) {
      console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
    } else if (m.text && m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
        chalk.blueBright("IN"),
        chalk.green(groupName)
      );
    }

//function
      async function uploadToTelegraph(filePath) {
          try {
            const fileStream = fs.createReadStream(filePath);
            const formData = new FormData();
            formData.append('file', fileStream);

            const response = await axios.post('https://telegra.ph/upload', formData, {
              headers: formData.getHeaders(),
            });

            if (response.status === 200) {
              const mediaUrl = "https://telegra.ph" + response.data[0].src;
              console.log('Media berhasil diunggah:', mediaUrl);
              return mediaUrl;
            } else {
              throw new Error('Gagal mengunggah media ke Telegra.ph');
            }
          } catch (error) {
            console.error('Terjadi kesalahan:', error.message);
            throw error;
          }
        }

        async function upload() {
          let fileExtension;
          let fileName;

          switch (messageType) {
            case 'imageMessage':
              fileExtension = 'jpeg';
              fileName = 'user.jpeg';
              break;
            case 'videoMessage':
              fileExtension = 'mp4';
              fileName = 'user.mp4';
              break;
            default:
              throw new Error('Invalid messageType');
          }

          const buffer = await downloadMediaMessage(m, 'buffer', {}, {
            reuploadRequest: client.updateMediaMessage
          });

          await writeFile(`./${fileName}`, buffer);
          const hasil = await uploadToTelegraph(fileName);
           fs.unlinkSync(fileName);

          return hasil;
        }
//---


if (m && m.key){
    await client.readMessages([m.key]);
    if (!m.isGroup) {
           await client.sendPresenceUpdate('composing', m.chat)
    }
}
      
if (m.text && !m.isGroup && !isCmd2) {
    try {
        const api = `https://api.azz.biz.id/api/alicia?q=${m.text}&user=${m.sender}&key=guelah`
    const hasil = await axios.get(api)
   return m.reply(hasil.data.respon)
    } catch (error) {
        return error
    }
}
         
function tf(t,f){
    return m.reply(`SAYA AKAN MEMBERIKAN PANDUAN UNTUK CARA MENGGUNAKAN FITUR INI
    
*penjelasan*: Fitur ini ${f}
    
*Cara penggunaan:* ${t}`)
}
    if (isCmd2) {
        switch (command) {
                case "menu":{                    m.reply(`
*Pemilik Bot* : Wa.me/6283808217881
*komunitas* : https://chat.whatsapp.com/Eo2rMdkStSf3kAqnIR7aHE


❚█═══════ Menu list ═══════❚█

꧁☆★  AI menu  ★☆꧂
- .ai
- .aiv
- .bardimg
- .bingimg
- .esrgan
- .google
- .toanime

꧁☆★  download menu  ★☆꧂
- .play
- .tiktok

꧁☆★  other menu  ★☆꧂
- .tourl
- .tts

❚█═ *©since 2022* ═❚█`)
        break};
            case "toanime":{
                if (messageType !== "imageMessage") {
                    return tf("kirim gambar dengan caption *.toanime","untuk mengubah face dalam gambar menjadi anime")
                }
                try {
                    const hasil = await axios.get(`https://aemt.me/toanime?url=${await upload()}`)
                    client.sendImage(from, hasil.data.url.img_crop_single,`sudah jadi`, m, mek)
                } catch (error) {
                    m.reply("Wajah tidak terdeteksi!")
                }
            break};
                
            case "tiktok":{
            if (!text) {
               return tf("ketik .tiktok <link> contoh *.tiktok https://www.tiktok.com/xxx*","untuk mendownload video tiktok")
            }
                try {
                    m.reply("*loading..*")
                    const hasil = await axios.get(`https://api.azz.biz.id/api/tiktok?url=${text}&key=guelah`);
                   await client.sendMessage(m.chat, { video : {url : hasil.data.video.no_watermark_hd}, mimetype: 'video/mp4', caption : `*tiktok no wm HD*`});
                } catch (error) {
                    m.reply("Apakah link bener bener valid?")
                }
                break};
                
            case "google" : {
                if (text) {
                    try {
                        await m.reply("*Loading..*")
  const response = await axios.get(`https://api.azz.biz.id/api/azz?q=${text}&key=guelah`);
  const hasil = response.data.hasil;
  m.reply(hasil)
} catch (error) {
  // Handle error
  m.reply("Sedang error")
            }
                } else {
                    tf(`ketik .google <text>, contoh *.google siapa calon presiden Indonesia*`,`untuk mencari informasi dari google lewat AI`)
                }
            break};
                case "play": {
                    if (!text) {
                        return tf(`ketikan .play contoh *.play hymn for the weekend*`,`untuk Memutar video YouTube tapi dengan format mp3`)
                    }
                    m.reply("*Loading..*")
                    axios.get(`https://api.azz.biz.id/api/play?q=${text}&key=guelah`)
                    .then(async hasil => {
                        await client.sendMessage(m.chat, { audio: { url: hasil.data.mp3 }, mimetype: 'audio/mpeg' },{ quoted: m });
                    })
                    .catch(err => {
                        
m.reply("*Error: Gagal Mengunduh Audio*")
                    });
                    break;
                }
                case "bardimg": {
                    if (messageType === 'imageMessage') {
                        m.reply("*loading..*")
                        try {
                            const hasil = await upload()
                            const gambar = await axios.get(`https://api.yanzbotz.my.id/api/ai/bardimg?query=${text}&url=${hasil}&apiKey=rajafanny`);
                            return m.reply(gambar.data.result)
                        } catch (error) {

                            return m.reply("Oops! Something went wrong while processing the image.")
                        }
                    } else {
                        try {
                            await tf("kirim gambar dengan caption .bardimg contoh *.bardimg gambar apa ini*", `untuk menanyakan ke AI BARD dan AI akan mendeteksi gambar yang anda kirim`);
                        } catch (error) {
       m.reply("ada yang salah")
                        }
                    }
                    break;
                }

                case "esrgan":
                if (messageType === 'imageMessage') {
                    m.reply("*Loading..*");
                    try {
                        const rik = await upload();
                        await client.sendImage(from, `https://api.yanzbotz.my.id/api/tools/real-esrgan?url=${rik}&mode=8x&apiKey=rajafanny`, "Sudah HD", mek);
                    } catch (error) {
                     m.reply('ada yang error maaf ya')
                    }
                } else {
                    await tf("kirim gambar dengan caption *.esrgan*","Untuk mengubah gambar menjadi lebih HD");
                }
                break;

                case "bingimg":
                  if (!text) {
                    return tf(`ketikan .bingimg contoh *.bingimg gambar orang berdiri di tengah kota pada malam hari dan lampu neon yang indah dari gedung pencakar langit*`,`untuk Membuat gambar menggunakan bing`)
                  }

                  m.reply("*loading..*")

                  try {
                    const bing = await axios.get(`https://api.yanzbotz.my.id/api/text2img/bing-image?prompt=${text}&apiKey=rajafanny`)

                    if (bing.data.result && bing.data.result.length > 0) {
                      await client.sendImage(from, bing.data.result[0], "sudah jadi kak", mek)
                    } else {
                      
                      m.reply("No image found for the given query.")
                    }
                  } catch (error) {
                    m.reply("An error occurred while fetching the Bing image. Please try again later.")
                  }
                  break;

            case "sc":{
                m.reply("Sc ini di jual, minat chat owner wa.me/628380821781")
                break};
                case "tts": {
                    const t = text.split(" | ");
                    if (t.length !== 2 || !t[0] || !t[1]) {
                        return tf(`untuk Mengubah teks menjadi suara. daftar suara :
"Rachel",
"Clyde",
"Domi",
"Dave",
"Fin",
"Bella",
"Antoni",
"Thomas",
"Charlie",
"Emily",
"Elli",
"Callum",
"Patrick",
"Harry",
"Liam",
"Dorothy",
"Josh",
"Arnold",
"Charlotte",
"Matilda",
"Matthew",
"James",
"Joseph",
"Jeremy",
"Michael",
"Ethan",
"Gigi",
"Freya",
"Grace",
"Daniel",
"Serena",
"Adam",
"Nicole",
"Jessie",
"Ryan",
"Sam",
"Glinda",
"Giovanni",
"Mimi",
"Alex"

Please provide text in the format: 'text | speaker'. For example: *.tts hello how are you | Sam*`, `To convert text to human-like speech`);
                    }

                    m.reply('*Loading..*');
                    const hasil = t[1].charAt(0).toUpperCase() + t[1].slice(1).toLowerCase();
                    try {
                        await client.sendMessage(
                            m.chat,
                            { audio: { url: `https://api.azz.biz.id/api/elevenlabs?q=${t[0]}&model=${hasil}&key=guelah` }, mimetype: 'audio/mp4', ptt: true },
                            { quoted: m }
                        );
                    } catch (error) {
                        return m.reply(`An error occurred while converting text to speech. Please try again later.`);
                    }
                    break;
                }


                case "aiv": {
                    if (!text) {
                        return tf(`ketik .aiv contoh *.aiv cara mandi junub*`,"untuk bertanya kepada AI tapi AI itu akan merespon dengan VN")
                    }

                    try {
                        m.reply('*Loading..*');
                        await client.sendMessage(
                            m.chat,
                            { audio: { url: `https://api.azz.biz.id/api/alicia-voice?q=${text}&user=${m.sender}&key=guelah` }, mimetype: 'audio/mp4',ptt:true },
                            { quoted: m }
                        );
                    } catch (error) {
      m.reply("Oops! Something went wrong while processing your request.");
                    }
                    break;
                }

                case 'tourl': {
                  if (messageType !== 'imageMessage' && messageType !== 'videoMessage') {
                    await tf('Kirim gambar dengan caption *.tourl*', 'Untuk mengupload Gambar ke server cloud telegra.ph');
                  } else {
                    try {
                      await m.reply('Sedang mengkonversi ke link...');
                      const hasil = await upload();
                      if (hasil) {
                        await m.reply(hasil);
                      } else {
                        await m.reply('Gagal mengupload gambar ke server.');
                      }
                    } catch (error) {
                      await m.reply('Terjadi kesalahan dalam mengupload gambar.');
                    }
                  }
                  break;
                }

                case "ai":
                if (!m.isGroup) {
                    m.reply("fitur hanya untuk group, karena di private chat sudah auto ai");
                } else {
                    if (text) {
                        m.reply("*loading..*");
                        try {
                            const apik = `https://api.azz.biz.id/api/alicia?q=${text}&user=${m.sender}&key=guelah`;
                            const hasil = await axios.get(apik);
                            m.reply(hasil.data.respon);
                        } catch (error) {
                            m.reply("Terjadi kesalahan saat memproses permintaan AI.");
                        }
                    } else {
                        m.reply("Contoh: .ai apa kabar");
                    }
                }
                break;

        }
    }

  } catch (err) {
    await m.reply("error ya")
      await client.sendMessage("6283808217881@s.whatsapp.net", { text: `*[ ERROR ]*\n\n${util.format(err)}` }, { quoted:m})
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
