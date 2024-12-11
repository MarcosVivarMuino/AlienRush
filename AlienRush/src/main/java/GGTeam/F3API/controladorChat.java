package GGTeam.F3API;

import java.util.concurrent.CopyOnWriteArrayList;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
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
	public ResponseEntity<ChatMessage> newMessage(@RequestBody ChatMessage chatMessage) {
		 // Procesa el mensaje recibido
        	System.out.println("Usuario: " + chatMessage.getNombre());
        	System.out.println("Mensaje: " + chatMessage.getMessage());
			listUsu.add(chatMessage);
			return new ResponseEntity<>(HttpStatus.OK);
	}
}