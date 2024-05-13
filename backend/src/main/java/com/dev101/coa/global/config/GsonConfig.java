package com.dev101.coa.global.config;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dev101.coa.domain.code.entity.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

@Configuration
public class GsonConfig {
	@Bean
	public Gson gson() {
		return new GsonBuilder()
			.registerTypeAdapter(LocalDate.class, new LocalDateTypeAdapter())
			.create();
	}

	public static class LocalDateTypeAdapter
		implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate>
	{
		private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		@Override
		public JsonElement serialize(
			final LocalDate date,
			final java.lang.reflect.Type typeOfSrc,
			final JsonSerializationContext context
		) {
			return new JsonPrimitive(date.format(formatter));
		}

		@Override
		public LocalDate deserialize(
			final JsonElement json,
			final java.lang.reflect.Type typeOfT,
			final JsonDeserializationContext context
		) throws JsonParseException
		{
			return LocalDate.parse(json.getAsString(), formatter);
		}
	}
}
