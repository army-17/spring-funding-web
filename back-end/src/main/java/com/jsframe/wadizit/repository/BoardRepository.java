package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface BoardRepository extends CrudRepository<Board, Long> {
    Page<Board> findByBoardNumGreaterThanOrderByBoardNumAsc(long boardNum, Pageable pageable);

    Page<Board> findByBoardNumGreaterThanOrderByBoardNumDesc(long boardNum, Pageable pb);
}
