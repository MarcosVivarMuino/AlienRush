package GGTeam.F3API;

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class controladorChat {

	List<ChatMessage> listUsu = new CopyOnWriteArrayList<>();
	
	@GetMapping("/chat")
	public List<ChatMessage> getChat() {
		return listUsu;
	}
	
	@PostMapping("/chat")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<ChatMessage> newMessage(@RequestBody ChatMessage ChatMessage) {
		 // Procesa el mensaje recibido
			listUsu.add(ChatMessage);
			return new ResponseEntity<>(HttpStatus.OK);
	}
}