// ============================================================================
// Board Todo List - 완전한 풀버전 (2025-12-08)
// 모든 CRUD + 상태토글 + 모달 + 반응형
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    loadTodoLists();
});

// ============================================================================
// 1. 데이터 로드 & 화면 표시
// ============================================================================
function loadTodoLists() {
    fetch('/api/getTodoList?page=1&pageSize=100')
        .then(response => response.json())
        .then(data => {
            const todos = data.data || [];
            displayTodoLists(todos);
        }).catch(err => {
            console.error('로드 실패:', err);
            document.getElementById('todoLists').innerHTML =
                '<p style="text-align:center;color:white;font-size:18px;padding:40px;">데이터 로드 실패</p>';
        });
}

function displayTodoLists(todos) {
    const container = document.getElementById('todoLists');
    if (todos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:white;font-size:18px;padding:40px;">Todo가 없습니다.</p>';
        return;
    }

    container.innerHTML = `
        <div class="list-card">
            <div class="list-header">
                <div class="list-title">📝 내 Todo 리스트 <span style="font-size:0.8em;color:#e0e0e0;">(${todos.length}개)</span></div>
                <button class="add-list-button" onclick="showCreateTodo()">
                    <i class="fas fa-plus"></i> 새 Todo
                </button>
            </div>
            <table class="todo-table">
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>내용</th>
                        <th>작성일</th>
                        <th>상태</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${todos.map(todo => `
                        <tr class="todo-row ${todo.STATUS == 1 ? 'completed' : ''}">
                            <td class="todo-name">${todo.TITLE}</td>
                            <td>${todo.CONTENT || '-'}</td>
                            <td>${todo.registDate}</td>
                            <td>${todo.STATUS == 1 ? '✅ 완료' : '⏳ 진행중'}</td>
                            <td class="todo-actions">
                                <button class="done-btn" onclick="toggleTodo(${todo.TODO_ID})">
                                    ${todo.STATUS == 1 ? '↩️ 취소' : '✅ 완료'}
                                </button>
                                <button class="edit-todo" onclick="editTodo(${todo.TODO_ID})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-todo" onclick="deleteTodo(${todo.TODO_ID})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ============================================================================
// 2. CRUD API 함수들 (전역 - 호이스팅 안전)
// ============================================================================
function addTodo() {
    const title = document.getElementById('createTitle').value.trim();
    const content = document.getElementById('createContent').value.trim();

    if (!title) return alert('제목을 입력하세요!');

    fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            content: content || null
        })
    })
    .then(response => response.json())
    .then(() => {
        loadTodoLists();
    })
    .catch(err => alert('추가 실패: ' + err));
}

function updateTodo(todoId) {
    const title = document.getElementById('editTitle').value.trim();
    const content = document.getElementById('editContent').value.trim();

    if (!title) return alert('제목을 입력하세요!');

    fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            content: content || null
        })
    })
    .then(() => {
        loadTodoLists();
    })
    .catch(err => alert('수정 실패: ' + err));
}

function toggleTodo(todoId) {
    fetch(`/api/todos/${todoId}/status`, {
        method: 'PATCH'
    })
    .then(() => loadTodoLists())
    .catch(err => alert('상태 변경 실패: ' + err));
}

function deleteTodo(todoId) {
    if (confirm('정말 삭제하시겠습니까?')) {
        fetch(`/api/todos/${todoId}`, {
            method: 'DELETE'
        })
        .then(() => loadTodoLists())
        .catch(err => alert('삭제 실패: ' + err));
    }
}

// ============================================================================
// 3. 모달 UI 함수들
// ============================================================================
function showCreateTodo() {
    const container = document.getElementById('todoLists');
    container.innerHTML = createTodoModalHTML();

    document.getElementById('createTodoForm').onsubmit = function(e) {
        e.preventDefault();
        addTodo();
    };
}

function editTodo(todoId) {
    fetch(`/api/todos/${todoId}`)
        .then(response => response.json())
        .then(todo => {
            const container = document.getElementById('todoLists');
            container.innerHTML = editTodoModalHTML(todo);

            document.getElementById('editTodoForm').onsubmit = function(e) {
                e.preventDefault();
                updateTodo(todo.TODO_ID);
            };
        })
        .catch(err => alert('상세 조회 실패: ' + err));
}

// 모달 HTML 헬퍼 함수들
function createTodoModalHTML() {
    return `
        <div class="edit-modal">
            <div class="edit-header">
                <h2><i class="fas fa-plus"></i> 새 Todo 추가</h2>
                <button class="edit-btn-cancel" onclick="loadTodoLists()">목록으로</button>
            </div>
            <form id="createTodoForm" class="edit-form">
                <input type="text" id="createTitle" placeholder="제목을 입력하세요" class="edit-input" required maxlength="200">
                <textarea id="createContent" rows="4" placeholder="내용 (선택사항)" class="edit-textarea" maxlength="1000"></textarea>
                <div class="edit-buttons">
                    <button type="button" class="edit-btn-cancel" onclick="loadTodoLists()">취소</button>
                    <button type="submit" class="edit-btn-save">추가하기</button>
                </div>
            </form>
        </div>
    `;
}

function editTodoModalHTML(todo) {
    return `
        <div class="edit-modal">
            <div class="edit-header">
                <h2><i class="fas fa-edit"></i> Todo 수정</h2>
                <button class="edit-btn-cancel" onclick="loadTodoLists()">목록으로</button>
            </div>
            <form id="editTodoForm" class="edit-form">
                <input type="hidden" id="editTodoId" value="${todo.TODO_ID}">
                <input type="text" id="editTitle" value="${todo.TITLE || ''}" class="edit-input" required maxlength="200">
                <textarea id="editContent" rows="4" class="edit-textarea">${todo.CONTENT || ''}</textarea>
                <div class="edit-buttons">
                    <button type="button" class="edit-btn-cancel" onclick="loadTodoLists()">취소</button>
                    <button type="submit" class="edit-btn-save">수정완료</button>
                </div>
            </form>
        </div>
    `;
}
