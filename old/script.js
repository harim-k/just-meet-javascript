// 페이지가 로드될 때 실행되는 함수
window.onload = function () {
    const maleProfileList = document.getElementById("male-profiles");
    const femaleProfileList = document.getElementById("female-profiles");

    // 프로필 데이터를 가져와서 표시
    var profiles = JSON.parse(localStorage.getItem("profiles")) || [];

    profiles.forEach(function (profile, index) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${profile.name}</strong>, ${profile.age}세<br>자기소개: ${profile.bio}<br>이상형: ${profile.idealType}`;

        // 삭제 버튼 추가
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "삭제";
        deleteButton.className = "delete-button"; // 삭제 버튼에 클래스 추가
        deleteButton.addEventListener("click", function () {
            // 삭제 버튼 클릭 시 해당 프로필 삭제
            profiles.splice(index, 1);
            // 로컬 스토리지 업데이트
            localStorage.setItem("profiles", JSON.stringify(profiles));
            // 다시 로드하여 업데이트된 목록 표시
            location.reload();
        });

        listItem.appendChild(deleteButton);

        if (profile.gender === "남자") {
            maleProfileList.appendChild(listItem);
        } else if (profile.gender === "여자") {
            femaleProfileList.appendChild(listItem);
        }
    });
};
