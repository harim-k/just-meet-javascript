const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const maleProfilesFilePath = path.join(__dirname, "male_profiles.json");
const femaleProfilesFilePath = path.join(__dirname, "female_profiles.json");

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// 남성 프로필 조회 API 엔드포인트
app.get("/api/male_profiles", (req, res) => {
    readProfiles(maleProfilesFilePath, res);
});

// 여성 프로필 조회 API 엔드포인트
app.get("/api/female_profiles", (req, res) => {
    readProfiles(femaleProfilesFilePath, res);
});

// 프로필 생성 API 엔드포인트
app.post("/api/profiles", (req, res) => {
    const newProfile = req.body;
    const gender = newProfile.gender === "남자" ? "male" : "female";
    const profilesFilePath = path.join(
        __dirname,
        `${gender}_profiles.json`
    );
    readProfiles(profilesFilePath, res, (profiles) => {
        profiles.push(newProfile);
        saveProfiles(profilesFilePath, profiles, res);
    });
});

    function readProfiles(filePath, res, callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("프로필 데이터를 읽는 중 오류 발생:", err);
            res.status(500).json({error: "프로필 데이터를 읽는 중 오류 발생"});
            return;
        }

        try {
            const profiles = JSON.parse(data);
            if (callback) {
                callback(profiles);
            } else {
                res.json(profiles);
            }
        } catch (error) {
            console.error("프로필 데이터 파싱 중 오류 발생:", error);
            res.status(500).json({error: "프로필 데이터 파싱 중 오류 발생"});
        }
    });
}


// 프로필 수정
app.post('/api/profiles', async (req, res) => {
    const newProfile = req.body;
    const profileName = req.query.name;
    const gender = req.query.gender; // '남자' 또는 '여자' 값으로 받음

    // 적절한 프로필 파일 선택
    const profilesFilePath = gender === '남자' ? maleProfilesFilePath : femaleProfilesFilePath;

    try {
        // 해당 성별의 프로필 파일 불러오기
        const data = await fs.promises.readFile(profilesFilePath, { encoding: 'utf-8' });
        const profiles = JSON.parse(data);

        // 프로필 삭제
        const updatedProfiles = updatedProfiles.filter(profile => profile.name !== profileName);
        // 변경된 프로필 추가
        updatedProfiles.add(newProfile)

        // 업데이트된 프로필 파일 저장
        await fs.promises.writeFile(profilesFilePath, JSON.stringify(updatedProfiles, null, 2), { encoding: 'utf-8' });

        res.json({ message: '프로필이 삭제되었습니다.' });
    } catch (error) {
        console.error('프로필 삭제 중 오류 발생:', error);
        res.status(500).json({ error: '프로필 삭제 중 오류가 발생했습니다.' });
    }
});

function saveProfiles(filePath, profiles, res) {
    fs.writeFile(filePath, JSON.stringify(profiles), (err) => {
        if (err) {
            console.error("프로필 데이터를 저장하는 중 오류 발생:", err);
            res.status(500).json({error: "프로필 데이터를 저장하는 중 오류 발생"});
            return;
        }

        res.status(201).json({message: "프로필 저장 완료"});
    });
}

// 프로필 삭제 엔드포인트
app.delete('/api/profiles', async (req, res) => {
    const profileName = req.query.name;
    const gender = req.query.gender; // '남자' 또는 '여자' 값으로 받음

    // 적절한 프로필 파일 선택
    const profilesFilePath = gender === '남자' ? maleProfilesFilePath : femaleProfilesFilePath;

    try {
        // 해당 성별의 프로필 파일 불러오기
        const data = await fs.promises.readFile(profilesFilePath, { encoding: 'utf-8' });

        const profiles = JSON.parse(data);

        // 프로필 삭제
        const updatedProfiles = profiles.filter(profile => profile.name !== profileName);

        // 업데이트된 프로필 파일 저장
        await fs.promises.writeFile(profilesFilePath, JSON.stringify(updatedProfiles, null, 2), { encoding: 'utf-8' });

        res.json({ message: '프로필이 삭제되었습니다.' });
    } catch (error) {
        console.error('프로필 삭제 중 오류 발생:', error);
        res.status(500).json({ error: '프로필 삭제 중 오류가 발생했습니다.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
