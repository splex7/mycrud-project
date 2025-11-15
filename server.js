require('dotenv').config();
const express = require("express");
const mysql = require('mysql2/promise');
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// MySQL database connection
const db = require('./config/db');

// Read all teams from database
async function readData() {
  try {
    const [rows] = await db.execute('SELECT id, name, members FROM teams ORDER BY id');
    return rows;
  } catch (error) {
    console.error('Error reading data from database:', error);
    throw error;
  }
}

// Write data to database - this will be handled by specific functions for create, update, delete
// MySQL operations will be handled directly in the route handlers

// 모든 팀 조회
app.get("/teams", async (req, res) => {
  try {
    const teams = await readData();
    res.json(teams);
  } catch (error) {
    console.error('Error in GET /teams:', error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

// 팀 추가
app.post("/teams", async (req, res) => {
  try {
    const { name, members } = req.body;
    const [result] = await db.execute(
      'INSERT INTO teams (name, members) VALUES (?, ?)',
      [name, members]
    );
    
    // Return the newly created team
    const newTeam = {
      id: result.insertId,
      name,
      members
    };
    
    const allTeams = await readData();
    res.json({ message: "추가 완료", data: allTeams, newTeam });
  } catch (error) {
    console.error('Error in POST /teams:', error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

// 팀 수정 (ID 기반)
app.put("/teams/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, members } = req.body;

    // Check if team exists
    const [existing] = await db.execute(
      'SELECT id FROM teams WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: "해당 팀 없음" });
      return;
    }

    // Update the team
    await db.execute(
      'UPDATE teams SET name = ?, members = ? WHERE id = ?',
      [name, members, id]
    );

    const allTeams = await readData();
    res.json({ message: "수정 완료", data: allTeams });
  } catch (error) {
    console.error('Error in PUT /teams/:id:', error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

// 팀 삭제 (ID 기반)
app.delete("/teams/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if team exists
    const [existing] = await db.execute(
      'SELECT id FROM teams WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: "해당 팀 없음" });
      return;
    }

    // Delete the team
    await db.execute('DELETE FROM teams WHERE id = ?', [id]);

    const allTeams = await readData();
    res.json({ message: "삭제 완료", data: allTeams });
  } catch (error) {
    console.error('Error in DELETE /teams/:id:', error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});

