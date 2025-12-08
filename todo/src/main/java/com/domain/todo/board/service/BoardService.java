package com.domain.todo.board.service;

import com.domain.todo.board.mapper.BoardMapper;
import com.domain.todo.exception.ApiException;
import com.domain.todo.exception.ExceptionCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper boardMapper;

    public Map<String, Object> getTodoList(Map<String,Object> param) {
        Map<String,Object> result = new HashMap<>();
        result.put("data", boardMapper.getTodoList(param));
        result.put("todoCnt", boardMapper.getTodoListCnt(param));
        return result;
    }

    public Map<String, Object> getTodoDetail(int todoId) {
        Map<String, Object> result = boardMapper.getTodoDetail(todoId);
        if (result == null || result.isEmpty()) {
            throw new ApiException(ExceptionCode.TODO_NOT_FOUND);
        }
        return result;
    }

    public Map<String, Object> addTodo(Map<String, Object> param) {
        validateTodoParam(param);
        param.put("registDate", LocalDateTime.now());
        boardMapper.addTodo(param);
        return param;
    }

    public Map<String, Object> updateTodo(Map<String, Object> param) {
        validateTodoParam(param);
        int todoId = (Integer) param.get("todoId");
        getTodoOrThrow(todoId);
        boardMapper.updateTodo(param);
        return param;
    }

    public Map<String, Object> updateTodoStatus(Map<String, Object> param) {
        int todoId = (Integer) param.get("todoId");
        int status = (Integer) param.get("status");

        getTodoOrThrow(todoId);  // 존재 확인

        Map<String, Object> updateParam = new HashMap<>();
        updateParam.put("todoId", todoId);
        updateParam.put("status", status);

        boardMapper.updateTodoStatus(updateParam);
        return Map.of("todoId", todoId, "status", status);
    }

    public Map<String, Object> deleteTodo(int todoId) {
        getTodoOrThrow(todoId);
        boardMapper.deleteTodo(todoId);
        return Map.of("todoId", todoId);
    }

    private Map<String, Object> getTodoOrThrow(int todoId) {
        Map<String, Object> todo = boardMapper.getTodoDetail(todoId);
        if (todo == null || todo.isEmpty()) {
            throw new ApiException(ExceptionCode.TODO_NOT_FOUND);
        }
        return todo;
    }

    private void validateTodoParam(Map<String, Object> param) {
        String title = (String) param.get("title");
        if (title == null || title.trim().isEmpty()) {
            throw new ApiException(ExceptionCode.INVALID_TITLE);
        }
        if (title.length() > 200) {
            throw new ApiException(ExceptionCode.TITLE_TOO_LONG);
        }
    }

}
