package com.jsframe.wadizit.repository;

import com.jsframe.wadizit.entity.Funding;
import com.jsframe.wadizit.entity.FundingFile;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FundingFileRepository extends CrudRepository<FundingFile, Long> {
    List<FundingFile> findByFundingNum(Funding funding);

    void deleteByFundingNum(Funding funding);
}
