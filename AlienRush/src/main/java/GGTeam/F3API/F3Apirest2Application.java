package GGTeam.F3API;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication
@EnableWebSocket
public class F3Apirest2Application {

	public static void main(String[] args) {
		SpringApplication.run(F3Apirest2Application.class, args);
	}

}
