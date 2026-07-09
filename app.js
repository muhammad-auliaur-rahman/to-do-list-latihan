let tanggal = document.getElementById("date");
// Perbaikan 1: Ambil elemennya saja, jangan ambil teks/value-nya dulu di sini
let taskInput = document.getElementById("task-input");
let taskDeadline = document.getElementById("task-deadline");
let btnAddTask = document.getElementById("submit-task");
let todoColum = document.getElementById("todo-column");
let semuaTombolPrio = document.querySelectorAll(".btn-prio");
let prioritasTerpilih = "Low";
let doneColums = document.getElementById("done-column");
let ClearAllTask = document.getElementById("clear-all-btn");

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

  const opsiJam = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const jam = sekarang.toLocaleTimeString("id-ID", opsiJam);

  tanggal.innerText = `${formatTanggal} - Jam ${jam}`;
}

setInterval(updateWaktu, 1000);
updateWaktu();
// --- AKHIR LOGIKA TANGGAL ---
// --- Logika Prio---
for (let tombol of semuaTombolPrio) {
  tombol.addEventListener("click", function () {
    document.querySelector(".btn-prio.active").classList.remove("active");
    this.classList.add("active");
    prioritasTerpilih = this.getAttribute("data-prio");
  });
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

  let opsiTanggal = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  let deadline = new Date(deadlineRaw).toLocaleDateString("id-ID", opsiTanggal);
  // Membuat element kotak tugas baru
  let kotakTugasBaru = document.createElement("div"); // Menggunakan 'div' huruf kecil
  kotakTugasBaru.className = "task-item";

  // Set attribute (Perbaikan salah ketik data-deadline)
  kotakTugasBaru.setAttribute("data-prio", prioritasTerpilih);
  kotakTugasBaru.setAttribute("data-deadline", deadline);

  // Mengisi struktur HTML internal kotak tugas baru
  // Perbaikan: mengubah ${taskInput} menjadi ${task}
  kotakTugasBaru.innerHTML = `
    <div class="task-left">
      <input
        type="checkbox"
        class="checkbox-container"
      />
      <div class="task-details">
        <span class="task-text">${task}</span>
        <span class="task-time">⏳ Tanggal: ${deadline} | Prio: ${prioritasTerpilih}</span>
      </div>
    </div>
    <button class="delete-btn">Hapus</button>
  `;

  // Masukkan tugas baru ke dalam kolom To Do
  todoColum.appendChild(kotakTugasBaru);

  // Reset input setelah berhasil submit
  taskInput.value = "";
  taskDeadline.value = "";
  document.querySelector(".btn-prio.active").classList.remove("active");
  semuaTombolPrio[0].classList.add("active");
  prioritasTerpilih = "Low";
}

btnAddTask.addEventListener("click", addTask);

// ----akhir logika tambah task

//  awal logika merubah dari to do ke done colum dan sebaliknya
todoColum.addEventListener("click", function (event) {
  if (event.target.classList.contains("checkbox-container")) {
    if (event.target.checked) {
      let itemTugas = event.target.closest(".task-item");
      doneColums.appendChild(itemTugas);
    }
  }
});

doneColums.addEventListener("click", function (event) {
  if (event.target.classList.contains("checkbox-container")) {
    if (!event.target.checked) {
      let itemTugas = event.target.closest(".task-item");
      todoColum.appendChild(itemTugas);
    }
  }
});
// ---selesai

function hapusTugas(event) {
  if (event.target.classList.contains("delete-btn")) {
    let itemTugas = event.target.closest(".task-item");
    itemTugas.remove();
  }
}

todoColum.addEventListener("click", hapusTugas);
doneColums.addEventListener("click", hapusTugas);

ClearAllTask.addEventListener("click", function () {
  let konfirmasi = confirm("Apakah kamu yakin ingin menghapus semua tugas?");
  if (konfirmasi) {
    doneColums.innerHTML = "";
    todoColum.innerHTML = "";
  }
});
