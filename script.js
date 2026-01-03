const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzzeL2LU8OmA8hoUcSzYUTmntw70jQ1TdSt7NywluPUHxWAZ1l5XdS1cXrcApTFBSHM/exec";
const fileInput = document.getElementById("fileInput");
const nameInput = document.getElementById("filename");
const extSelect = document.getElementById("extension");
const uploadBtn = document.getElementById("uploadBtn");

/* AUTO FILL */
fileInput.onchange = () => {
  const file = fileInput.files[0];
  if(!file) return;

  const parts = file.name.split(".");
  nameInput.value = parts.slice(0,-1).join(".");
  extSelect.value = "." + parts.pop().toLowerCase();
};

/* UPLOAD */
uploadBtn.onclick = () => {
  if(!fileInput.files.length) return alert("Select file");
  if(!nameInput.value.trim()) return alert("Enter filename");

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    fetch(WEB_APP_URL,{
      method:"POST",
      body:JSON.stringify({
        folderId:FOLDER_ID,
        fileName:nameInput.value + extSelect.value,
        mimeType:file.type,
        fileData:reader.result.split(",")[1]
      })
    })
    .then(r=>r.json())
    .then(d=>{
      alert("Upload Successful");
      loadFiles();
      fileInput.value="";
    });
  };
  reader.readAsDataURL(file);
};

/* ICONS */
const icons={
   pdf: "https://daneyzp.github.io/Upload-list/pdf.svg",
  doc: "https://daneyzp.github.io/Upload-list/doc.svg",
  docx: "https://daneyzp.github.io/Upload-list/docx.png",
  xls: "https://daneyzp.github.io/Upload-list/xls.svg",
  xlsx: "https://daneyzp.github.io/Upload-list/xlsx.svg",
  jpg: "https://daneyzp.github.io/Upload-list/jpg.png",
  jpeg: "https://daneyzp.github.io/Upload-list/jpeg.png",
  png: "https://daneyzp.github.io/Upload-list/png.png",
  gif: "https://daneyzp.github.io/Upload-list/gif.gif",
  html: "https://daneyzp.github.io/Upload-list/html.svg",
  css: "https://daneyzp.github.io/Upload-list/css.svg",
  js: "https://daneyzp.github.io/Upload-list/js.svg",
  txt: "https://daneyzp.github.io/Upload-list/txt.svg",
  php: "https://daneyzp.github.io/Upload-list/php.svg",
  zip: "https://daneyzp.github.io/Upload-list/zip.svg",
  rar: "https://daneyzp.github.io/Upload-list/rar.svg",
  fbx: "https://daneyzp.github.io/Upload-list/fbx.png",
  default: "https://daneyzp.github.io/Upload-list/default.png"
};

/* LOAD FILES */
function loadFiles(){
  fetch(WEB_APP_URL+"?folderId="+FOLDER_ID)
  .then(r=>r.json())
  .then(files=>{
    const box=document.getElementById("fileContainer");
    box.innerHTML="";
    files.forEach(f=>{
      const ext=f.ext.toLowerCase();
      box.innerHTML+=`
      <div class="file-card">
        <img class="file-icon" src="${icons[ext]||icons.default}">
        <div class="file-info">
          <div class="file-name">${f.name}</div>
          <div class="file-size">${f.size}</div>
        </div>
        <a class="download-btn" href="${f.download}" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path fill="white" d="M12 16l4-4h-3V4h-2v8H8l4 4zm4 4H8c-1.1 0-2-.9-2-2v-2h2v2h8v-2h2v2c0 1.1-.9 2-2 2z"/>
            </svg>
        </a>
      </div>`;
    });
  });
}

loadFiles();