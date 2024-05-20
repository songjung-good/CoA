package com.dev101.coa.domain.redis;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedisRepoRepository extends CrudRepository<RedisResult, String> {
}
