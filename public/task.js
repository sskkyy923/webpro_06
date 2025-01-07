"use strict";

// 要素の取得
const taskTitleInput = document.getElementById("task-title");
const taskContentInput = document.getElementById("task-content");
const addTaskButton = document.getElementById("add-task");
const getTasksButton = document.getElementById("get-tasks");
const deleteTaskButton = document.getElementById("delete-task");
const taskIdInput = document.getElementById("task-id");
const taskListDiv = document.getElementById("task-list");

// タスクを追加する関数
function addTask() {
  const title = taskTitleInput.value.trim();
  const content = taskContentInput.value.trim();
  
  if (!title || !content) {
    alert("タスク名とタスク内容を入力してください。");
    return;
  }

  const params = {
    method: "POST",
    body: `title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const url = "http://localhost:8080/task"; // 実際のサーバーURLに変更してください
  
  fetch(url, params)
    .then(response => {
      if (!response.ok) {
        throw new Error('タスクの追加に失敗しました');
      }
      return response.json();
    })
    .then(response => {
      alert("タスクが追加されました！");
      taskTitleInput.value = "";
      taskContentInput.value = "";
      getTasks(); // タスク一覧を更新
    })
    .catch(error => {
      alert(error.message);
    });
}

// タスク一覧を取得する関数
function getTasks() {
  const url = "http://localhost:8080/task"; // サーバーURL
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("タスク一覧の取得に失敗しました");
      }
      return response.json();
    })
    .then(tasks => {
      taskListDiv.innerHTML = ""; // 一度リセット
      tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.innerHTML = `
          <p>ID: ${task.id}, タスク名: ${task.title}, 内容: ${task.content}</p>
        `;
        taskListDiv.appendChild(taskItem);
      });
    })
    .catch(error => {
      alert(error.message);
    });
}


// タスクを削除する関数
function deleteTask() {
  const taskId = taskIdInput.value.trim();
  
  if (!taskId) {
    alert("タスクIDを入力してください。");
    return;
  }

  const params = {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const url = `http://localhost:8080/task/${taskId}`; // 実際のサーバーURLに変更してください
  
  fetch(url, params)
    .then(response => {
      if (!response.ok) {
        throw new Error("タスクの削除に失敗しました");
      }
      alert("タスクが削除されました！");
      taskIdInput.value = "";
      getTasks(); // タスク削除後に一覧を更新
    })
    .catch(error => {
      alert(error.message);
    });
}


// イベントリスナーを設定
addTaskButton.addEventListener("click", addTask);
getTasksButton.addEventListener("click", getTasks);
deleteTaskButton.addEventListener("click", deleteTask);

// 初期表示でタスク一覧を取得
getTasks();
