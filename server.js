const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static("public"));

// JSON 파일 읽기
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// JSON 파일 쓰기
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 모든 그룹 조회
app.get("/groups", (req, res) => {
  res.json(readData());
});

// 그룹 추가
app.post("/groups", (req, res) => {
  const groups = readData();
  groups.push(req.body);
  writeData(groups);
  res.json({ message: "추가 완료", data: groups });
});

// 그룹 수정
app.put("/groups/:index", (req, res) => {
  const groups = readData();
  const idx = parseInt(req.params.index);
  if (groups[idx]) {
    groups[idx] = req.body;
    writeData(groups);
    res.json({ message: "수정 완료", data: groups });
  } else {
    res.status(404).json({ message: "해당 그룹 없음" });
  }
});

// 그룹 삭제
app.delete("/groups/:index", (req, res) => {
  const groups = readData();
  const idx = parseInt(req.params.index);
  if (groups[idx]) {
    groups.splice(idx, 1);
    writeData(groups);
    res.json({ message: "삭제 완료", data: groups });
  } else {
    res.status(404).json({ message: "해당 그룹 없음" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

