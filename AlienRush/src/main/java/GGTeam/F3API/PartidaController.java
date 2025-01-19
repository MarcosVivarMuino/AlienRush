package GGTeam.F3API;

import GGTeam.F3API.Lobby;
import GGTeam.F3API.Partida;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.concurrent.ConcurrentHashMap;

@Controller
public class PartidaController {
	 private final ConcurrentHashMap<Integer, Partida> partidas = new ConcurrentHashMap<>();

	    @MessageMapping("/update") 
	    @SendTo("/topic/positions")
	    public Partida actualizarPartida(Partida partida) {
	        partidas.put(partida.getId(), partida);
	        partida.moverObjetos();
	        return partida;
	    }


	    @MessageMapping("/start")
	    @SendTo("/topic/start")
	    public Partida iniciarPartida(Lobby lobby) {
	        int lobbyId = lobby.getId();

	        Partida partida = partidas.computeIfAbsent(lobbyId, id -> {
	            Partida nuevaPartida = new Partida();
	            nuevaPartida.setId(lobbyId);
	            return nuevaPartida;
	        });

	        System.out.println("Partida iniciada para el lobby: " + lobbyId);
	        return partida;
	    }
}
