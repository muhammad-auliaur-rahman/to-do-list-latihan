let tanggal = document.getElementById("date");
let taskInput = document.getElementById("task-input");
let taskDeadline = document.getElementById("task-deadline");
let btnAddTask = document.getElementById("submit-task");
let todoColum = document.getElementById("todo-column");
let semuaTombolPrio = document.querySelectorAll(".btn-prio");
let prioritasTerpilih = "Low";
let doneColums = document.getElementById("done-column");
let ClearAllTask = document.getElementById("clear-all-btn");
let displayNama = document.getElementById("nama");
let displayKerja = document.getElementById("pekerjaan");
let avatar = document.getElementById("avatar");
let btnEdit = document.getElementById("btn-edit");
let jendelaProfil = document.getElementById("from-profil");
let btnClose = document.getElementById("close-jendela");
let inputNama = document.getElementById("input-nama");
let inputPekerjaan = document.getElementById("input-pekerjaan");
let inputFoto = document.getElementById("link-foto");
let btnSave = document.getElementById("btn-simpan");

// LOGIKA AGAR INPUT TANGGAL MENGIKUTI HARI SEKARANG
function resetInputTanggalKeHariIni() {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const tanggalHari = String(sekarang.getDate()).padStart(2, "0");

  // Digabung menjadi format baku HTML: YYYY-MM-DD
  taskDeadline.value = `${tahun}-${bulan}-${tanggalHari}`;
}

resetInputTanggalKeHariIni();

// ARRAY UTAMA DAN MENAMBAHKAN KE LOKAL STORAGE
let listTugasLokal = JSON.parse(sessionStorage.getItem("myTodoList")) || [];

function simpanKeLocalStorage() {
  sessionStorage.setItem("myTodoList", JSON.stringify(listTugasLokal));
}

let dataProfil = JSON.parse(sessionStorage.getItem("userProfil")) || {};

function simpanUserData() {
  sessionStorage.setItem("userProfil", JSON.stringify(dataProfil));
}
// lLOADED PROFIL
function loadProfil() {
  if (dataProfil.nama) {
    displayNama.innerText = dataProfil.nama;
    displayKerja.innerText = dataProfil.pekerjaan;
    avatar.src = dataProfil.linkFoto;
  }
}

// MENGATUR NAMA, PERKERJAAN DAN LINK FOTO DENGAN PROMPT
function updateProfil() {
  let namaValue = inputNama.value.trim();
  let pekerjaanValue = inputPekerjaan.value.trim();
  let fileFoto = inputFoto.files[0];

  if (namaValue === "" || pekerjaanValue === "") {
    alert("Semua data profil harus diisi!");
    return;
  }

  function prosesSimpan(fotoSource) {
    dataProfil = {
      nama: namaValue,
      pekerjaan: pekerjaanValue,
      linkFoto: fotoSource,
    };
    simpanUserData();
    displayNama.innerText = namaValue;
    displayKerja.innerText = pekerjaanValue;
    avatar.src = fotoSource;

    jendelaProfil.classList.remove("active");
  }
  if (fileFoto) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let base64Image = e.target.result;
      prosesSimpan(base64Image);
    };
    reader.readAsDataURL(fileFoto);
  } else {
    let fotoLama = avatar.getAttribute("src");
    prosesSimpan(fotoLama);
  }
}

btnEdit.addEventListener("click", function () {
  jendelaProfil.classList.add("active");
});

btnClose.addEventListener("click", function () {
  jendelaProfil.classList.remove("active");
});

btnSave.addEventListener("click", updateProfil);

loadProfil();
// --- LOGIKA TANGGAL & WAKTU ---
function updateWaktu() {
  const sekarang = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatTanggal = sekarang.toLocaleDateString("id-ID", options);

  const jam = sekarang.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  tanggal.innerText = `${formatTanggal} - Jam ${jam}`;
}

setInterval(updateWaktu, 1000);
updateWaktu();
// --- AKHIR LOGIKA TANGGAL ---
// --- LOGIKA PRIORITAS---
for (let tombol of semuaTombolPrio) {
  tombol.addEventListener("click", function () {
    document.querySelector(".btn-prio.active").classList.remove("active");
    this.classList.add("active");
    prioritasTerpilih = this.getAttribute("data-prio");
  });
}
// buat elemen tugas (Fungsi Dom berjalan disini)
function buatElementTugas(tugas) {
  let opsiTanggal = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  // mengatur deadline
  let tanggalDeadline = new Date(tugas.deadline);
  tanggalDeadline.setHours(0, 0, 0, 0);

  let tanggalHariIni = new Date();
  tanggalHariIni.setHours(0, 0, 0, 0);

  let deadline = tanggalDeadline.toLocaleDateString("id-ID", opsiTanggal);
  let statusTeks = `⏳ Batas: ${deadline}`;
  if (tanggalHariIni > tanggalDeadline) {
    statusTeks = `❌ Batas: ${deadline} | <span style="color: red; font-weight: bold;">Terlambat!</span>`;
  }
  // Membuat element kotak tugas baru
  let kotakTugasBaru = document.createElement("div"); // Menggunakan 'div' huruf kecil
  kotakTugasBaru.className = "task-item";
  kotakTugasBaru.setAttribute("data-prio", tugas.prio);
  kotakTugasBaru.setAttribute("data-id", tugas.id);

  // Mengisi struktur HTML internal kotak tugas baru
  kotakTugasBaru.innerHTML = `
    <div class="task-left">
      <input
        type="checkbox"
        class="checkbox-container"
        ${tugas.isChecked ? "checked" : ""}
      />
      <div class="task-details">
        <span class="task-text">${tugas.teks}</span>
        <span class="task-time">${statusTeks} | Prio: ${tugas.prio}</span>
      </div>
    </div>
    <button class="delete-btn">Hapus</button>
  `;
  if (tugas.isChecked) {
    doneColums.appendChild(kotakTugasBaru);
  } else {
    todoColum.appendChild(kotakTugasBaru);
  }
}

// --- LOGIKA TAMBAH TUGAS (ADD TASK) ---
function addTask() {
  // Ambil value/nilai input tepat SAAT tombol diklik
  const task = taskInput.value.trim();
  const deadlineRaw = taskDeadline.value;

  // Validasi input
  if (task === "") {
    alert("Tugas tidak boleh kosong!");
    return;
  } else if (deadlineRaw === "") {
    alert("Deadline tidak boleh kosong!");
    return;
  }
  let tugasBaruObjek = {
    id: Date.now(),
    teks: task,
    deadline: deadlineRaw,
    prio: prioritasTerpilih,
    isChecked: false,
  };

  listTugasLokal.push(tugasBaruObjek);
  simpanKeLocalStorage();

  buatElementTugas(tugasBaruObjek);

  // code reset setelah berhasil submit
  taskInput.value = "";
  resetInputTanggalKeHariIni();
  document.querySelector(".btn-prio.active").classList.remove("active");
  semuaTombolPrio[0].classList.add("active");
  prioritasTerpilih = "Low";
}

btnAddTask.addEventListener("click", addTask);

// ----akhir logika tambah task
// muat tugas saat refres / mengambil data
function muatTugasDariLokalStorage() {
  for (const tugas of listTugasLokal) {
    buatElementTugas(tugas);
  }
}
muatTugasDariLokalStorage();
// CHECKBOX CODE
function handleCheckbox(event) {
  if (event.target.classList.contains("checkbox-container")) {
    let itemTugas = event.target.closest(".task-item");
    let idTugas = Number(itemTugas.getAttribute("data-id"));

    for (let tugas of listTugasLokal) {
      if (tugas.id === idTugas) {
        tugas.isChecked = event.target.checked;
        break;
      }
    }
    simpanKeLocalStorage();

    if (event.target.checked) {
      doneColums.appendChild(itemTugas);
    } else {
      todoColum.appendChild(itemTugas);
    }
  }
}
todoColum.addEventListener("click", handleCheckbox);
doneColums.addEventListener("click", handleCheckbox);
// ---selesai
// --- hapus tugas

function hapusTugas(event) {
  if (event.target.classList.contains("delete-btn")) {
    let itemTugas = event.target.closest(".task-item");
    let idTugas = Number(itemTugas.getAttribute("data-id"));
    listTugasLokal = listTugasLokal.filter((tugas) => tugas.id !== idTugas);
    simpanKeLocalStorage();
    itemTugas.remove();
  }
}
todoColum.addEventListener("click", hapusTugas);
doneColums.addEventListener("click", hapusTugas);
// logika button hapus all
ClearAllTask.addEventListener("click", function () {
  let konfirmasi = confirm("Apakah kamu yakin ingin menghapus semua tugas?");
  if (konfirmasi) {
    listTugasLokal = [];
    simpanKeLocalStorage();
    doneColums.innerHTML = "";
    todoColum.innerHTML = "";
  }
});
