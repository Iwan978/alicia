# Cek apakah file index.js sudah di jalankan di pm2
index_process=$(pm2 jlist | grep "index.js" | awk '{print $2}')

# Jika belum ada, jalankan index.js menggunakan pm2
if [ -z "$index_process" ]; then
 pm2 start index.js
 echo "index.js telah di jalankan menggunakan pm2"
else
 pm2 restart all
 echo "index.js sudah di jalankan di pm2 dengan process id $index_process"
fi

# Tampilkan logs dari index.js
figlet -f script AzzApi | lolcat
pm2 logs