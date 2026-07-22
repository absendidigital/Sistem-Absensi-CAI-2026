// =====================================
// SISTEM ABSENSI CAI 2026
// =====================================

// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwKgGvjwfsJ4-o0bjpy937zoaDUpZ1OjkrQscU1Mxyt1KP7HJIunvGmAWiKR8LzC5fN/exec";

// Variabel
let peserta = [];
let pesertaAktif = null;
let scanner = null;

// Tombol
const tombolScan = document.getElementById("scanBtn");
const tombolHadir = document.getElementById("hadir");
const tombolIzin = document.getElementById("izin");
const tombolKembali = document.getElementById("kembali");
const tombolPulang = document.getElementById("pulang");

// Nonaktifkan tombol saat awal
resetTombol();

// ===============================
// TANGGAL DAN JAM
// ===============================

function updateJamTanggal(){

    const sekarang = new Date();

    document.getElementById("tanggal").innerHTML =
    sekarang.toLocaleDateString("id-ID",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    });

    document.getElementById("jam").innerHTML =
    sekarang.toLocaleTimeString("id-ID");

}

updateJamTanggal();

setInterval(updateJamTanggal,1000);

// ===============================
// LOAD DATA PESERTA
// ===============================

function loadPeserta(){

    fetch(WEB_APP_URL)

    .then(res=>res.json())

    .then(data=>{

        peserta = data;

        console.log("Master peserta berhasil dimuat");

        console.log(peserta);

    })

    .catch(err=>{

        console.log(err);

        alert("Gagal mengambil data peserta.");

    });

}

loadPeserta();

// ===============================
// RESET
// ===============================

function resetTombol(){

    tombolHadir.disabled = true;
    tombolIzin.disabled = true;
    tombolKembali.disabled = true;
    tombolPulang.disabled = true;

}

// ===============================
// TAMPILKAN DATA PESERTA
// ===============================

function tampilPeserta(p){

    document.getElementById("namaPeserta").innerHTML =
    p.nama;

    document.getElementById("idPeserta").innerHTML =
    "ID : " + p.id;

    document.getElementById("desaPeserta").innerHTML =
    "Asal Desa : " + p.desa;

    document.getElementById("kelompokPeserta").innerHTML =
    "Kelompok : " + p.kelompok;

    document.getElementById("statusPeserta").innerHTML =
    "Status : " + p.status;

}

// ===============================
// CARI PESERTA
// ===============================

function cariPeserta(idQR){

    pesertaAktif = null;

    for(let i=0;i<peserta.length;i++){

        if(String(peserta[i].id).trim() ==
           String(idQR).trim()){

            pesertaAktif = peserta[i];

            break;

        }

    }

    if(pesertaAktif){

        tampilPeserta(pesertaAktif);

        document.getElementById("hasilScan").innerHTML =
        "✅ Peserta ditemukan";

        tombolHadir.disabled = false;
        tombolIzin.disabled = false;
        tombolKembali.disabled = false;
        tombolPulang.disabled = false;

    }else{

        document.getElementById("hasilScan").innerHTML =
        "❌ Peserta tidak ditemukan";

        alert("Peserta tidak ditemukan.");

    }

}

// ===============================
// SCAN QR
// ===============================

tombolScan.addEventListener("click",mulaiScan);

function mulaiScan(){

    scanner = new Html5Qrcode("reader");

    scanner.start(

        {facingMode:"environment"},

        {

            fps:10,

            qrbox:250

        },

        function(decodedText){

            scanner.stop();

            cariPeserta(decodedText);

        },

        function(error){

        }

    ).catch(function(err){

        alert("Tidak dapat membuka kamera.");

        console.log(err);

    });

}

// ===============================
// TOMBOL ABSENSI
// ===============================

tombolHadir.onclick=function(){

    kirimAbsensi("Hadir");

}

tombolIzin.onclick=function(){

    kirimAbsensi("Izin");

}

tombolKembali.onclick=function(){

    kirimAbsensi("Kembali");

}

tombolPulang.onclick=function(){

    kirimAbsensi("Pulang");

}

// ===============================
// KIRIM ABSENSI
// ===============================

function kirimAbsensi(status){

    if(pesertaAktif==null){

        alert("Scan QR terlebih dahulu.");

        return;

    }

    const data = new URLSearchParams();

    data.append("id",pesertaAktif.id);
    data.append("nama",pesertaAktif.nama);
    data.append("desa",pesertaAktif.desa);
    data.append("kelompok",pesertaAktif.kelompok);
    data.append("statusPeserta",pesertaAktif.status);
    data.append("sesi",document.getElementById("sesi").value);
    data.append("statusAcara",status);

    fetch(WEB_APP_URL,{

        method:"POST",

        body:data

    })

    .then(res=>res.text())

    .then(res=>{

        alert(res);

        pesertaAktif=null;

        resetTombol();

        document.getElementById("namaPeserta").innerHTML =
        "Belum Ada Peserta";

        document.getElementById("idPeserta").innerHTML =
        "ID : -";

        document.getElementById("desaPeserta").innerHTML =
        "Asal Desa : -";

        document.getElementById("kelompokPeserta").innerHTML =
        "Kelompok : -";

        document.getElementById("statusPeserta").innerHTML =
        "Status : -";

        document.getElementById("hasilScan").innerHTML =
        "Belum Ada QR Yang Dipindai";

    })

    .catch(err=>{

        alert("Gagal mengirim data.");

        console.log(err);

    });

}