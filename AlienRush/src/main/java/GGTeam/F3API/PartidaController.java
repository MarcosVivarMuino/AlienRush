package GGTeam.F3API;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;
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

        // Crear o recuperar la partida
        Partida nuevaPartida = partidas.computeIfAbsent(lobbyId, id -> {
            Partida p = new Partida();
            p.setId(lobbyId);
            return p;
        });

        // Inicializar la partida con los nombres de los jugadores del lobby
        nuevaPartida.inicializarPartida(
            lobby.getId(),
            lobby.getPlayer1Name(),  // Usamos los nombres directamente
            lobby.getPlayer2Name(),  // Lo mismo aquí
            nuevaPartida.getHumanos(),
            nuevaPartida.getVacas(),
            nuevaPartida.getMilitares(),
            nuevaPartida.getPUHumanos(),
            nuevaPartida.getEscombros()
        );

        System.out.println("Partida iniciada para el lobby: " + lobbyId);
        return nuevaPartida;
    }
}
