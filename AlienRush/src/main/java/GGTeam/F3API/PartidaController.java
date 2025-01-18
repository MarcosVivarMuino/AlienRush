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

	    // Endpoint para manejar actualizaciones de posición
	    @MessageMapping("/update") // Prefijo "/app/update"
	    @SendTo("/topic/positions") // Envía actualizaciones a "/topic/positions"
	    public Partida actualizarPartida(Partida partida) {
	        // Guardar o actualizar la partida
	        partidas.put(partida.getId(), partida);

	        // Calcular las nuevas posiciones (simulación)
	        partida.moverObjetos();

	        // Retornar el estado actualizado para los clientes
	        return partida;
	    }

	    // Iniciar una partida cuando ambos jugadores estén listos
	    @MessageMapping("/start")
	    @SendTo("/topic/start")
	    public Partida iniciarPartida(Lobby lobby) {
	        int lobbyId = lobby.getId();

	        // Crear una nueva partida o recuperar una existente
	        Partida partida = partidas.computeIfAbsent(lobbyId, id -> {
	            Partida nuevaPartida = new Partida();
	            nuevaPartida.setId(lobbyId);
	            return nuevaPartida;
	        });

	        System.out.println("Partida iniciada para el lobby: " + lobbyId);

	        return partida;
	    }
}
