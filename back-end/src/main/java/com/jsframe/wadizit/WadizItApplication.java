package com.jsframe.wadizit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class WadizItApplication {

	public static void main(String[] args) {
		SpringApplication.run(WadizItApplication.class, args);
	}

}
