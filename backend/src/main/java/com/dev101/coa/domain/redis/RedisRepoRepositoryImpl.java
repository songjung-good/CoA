package com.dev101.coa.domain.redis;

import java.util.Optional;
import java.util.stream.StreamSupport;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import com.google.gson.Gson;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RedisRepoRepositoryImpl implements RedisRepoRepository {

	private final RedisTemplate<String, String> redisTemplate;
	private final Gson gson;

	@Override
	public <S extends RedisResult> S save(S entity) {
		String json = gson.toJson(entity);
		redisTemplate.opsForValue().set("result:" + entity.getAnalysisId(), json);
		return entity;
	}

	@Override
	public <S extends RedisResult> Iterable<S> saveAll(Iterable<S> entities) {
		for (S entity : entities) {
			save(entity);
		}
		return entities;
	}

	@Override
	public Optional<RedisResult> findById(String id) {
		String json = redisTemplate.opsForValue().get("result:" + id);
		RedisResult result = gson.fromJson(json, RedisResult.class);
		return Optional.ofNullable(result);
	}

	@Override
	public boolean existsById(String id) {
		String json = redisTemplate.opsForValue().get("result:" + id);
		return json != null;
	}

	@Override
	public Iterable<RedisResult> findAll() {
		throw new UnsupportedOperationException("Not implemented");
	}

	@Override
	public Iterable<RedisResult> findAllById(Iterable<String> ids) {
		return StreamSupport.stream(ids.spliterator(), false)
			.map(this::findById)
			.filter(Optional::isPresent)
			.map(Optional::get)
			.toList();
	}

	@Override
	public long count() {
		throw new UnsupportedOperationException("Not implemented");
	}

	@Override
	public void deleteById(String id) {
		redisTemplate.delete("result:" + id);
	}

	@Override
	public void delete(RedisResult entity) {
		deleteById(entity.getAnalysisId());
	}

	@Override
	public void deleteAllById(Iterable<? extends String> ids) {
		for (String id : ids) {
			deleteById(id);
		}
	}

	@Override
	public void deleteAll(Iterable<? extends RedisResult> entities) {
		for (RedisResult entity : entities) {
			delete(entity);
		}
	}

	@Override
	public void deleteAll() {
		throw new UnsupportedOperationException("Not implemented");
	}
}