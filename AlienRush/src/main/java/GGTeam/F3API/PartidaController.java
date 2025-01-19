package GGTeam.F3API;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class PartidaController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ConcurrentHashMap<Integer, Partida> partidas = new ConcurrentHashMap<>();

    public PartidaController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/partida/iniciar")
    public void iniciarPartida(@Payload Lobby lobby) {
        if (lobby == null || lobby.getId() == 0) {
            System.out.println("Error: Lobby no válido recibido.");
            return;
        }

        int lobbyId = lobby.getId();

        // Crear o recuperar la partida asociada al lobby
        Partida partida = partidas.computeIfAbsent(lobbyId, id -> {
            Partida nuevaPartida = new Partida();
            nuevaPartida.inicializarPartida(
                lobby.getId(),
                lobby.getPlayer1Name(),
                lobby.getPlayer2Name(),
                nuevaPartida.getHumanos(),
                nuevaPartida.getVacas(),
                nuevaPartida.getMilitares(),
                nuevaPartida.getPUHumanos(),
                nuevaPartida.getEscombros()
            );
            return nuevaPartida;
        });

        System.out.println("Partida iniciada para el lobby: " + lobbyId);

        // Notificar a los jugadores que la partida ha iniciado
        messagingTemplate.convertAndSend("/topic/partida/actualizada/" + lobbyId, partida);
    }

    @MessageMapping("/partida/actualizar")
    public void actualizarPartida(@Payload Jugador jugador) {
        int partidaId = jugador.getPartidaId();  // Obtener el partidaId desde el jugador

        // Validar si la partida existe
        if (!partidas.containsKey(partidaId)) {
            return;
        }

        // Obtener la partida existente
        Partida partidaExistente = partidas.get(partidaId);

        // Identificar al jugador y actualizar su estado
        if (jugador.getNombre().equals(partidaExistente.getJugador1().getNombre())) {
            // Si es el Jugador 1, actualizamos sus datos
            partidaExistente.getJugador1().actualizar(jugador);
        } else if (jugador.getNombre().equals(partidaExistente.getJugador2().getNombre())) {
            // Si es el Jugador 2, actualizamos sus datos
            partidaExistente.getJugador2().actualizar(jugador);
        }

        // Mover objetos en la escena después de actualizar los jugadores
        partidaExistente.moverObjetos();

        // Enviar la partida actualizada a ambos jugadores
        messagingTemplate.convertAndSend("/topic/partida/actualizada/" + partidaId, partidaExistente);

        System.out.println("Partida actualizada: " + partidaId);
    }


    // Finalizar la partida
    @MessageMapping("/partida/finalizar")
    public void finalizarPartida(@Payload int lobbyId) {
        if (partidas.containsKey(lobbyId)) {
            partidas.remove(lobbyId);

            // Notificar a los jugadores que la partida ha finalizado
            messagingTemplate.convertAndSend("/topic/partida/finalizada/" + lobbyId, "La partida ha finalizado.");
            System.out.println("Partida con ID " + lobbyId + " finalizada.");
        } else {
            System.out.println("No se encontró la partida con ID " + lobbyId);
        }
    }
    
    @MessageMapping("/movJugador")
    public void actuPosiPlayer(@Payload int newLobbyId) {
        // Buscar la partida asociada al lobbyId
        Partida partida = partidas.get(newLobbyId);
        
        // Verificar si la partida existe
        if (partida == null) {
            System.out.println("No se encontró la partida con el ID: " + newLobbyId);
            return;
        }

        // Obtener las posiciones de los jugadores
        Jugador jugador1 = partida.getJugador1();
        Jugador jugador2 = partida.getJugador2();

        // Crear un objeto con las posiciones de los jugadores
        Map<String, Object> posiciones = new HashMap<>();
        posiciones.put("jugador1X", jugador1.getX());
        posiciones.put("jugador1Y", jugador1.getY());
        posiciones.put("jugador2X", jugador2.getX());
        posiciones.put("jugador2Y", jugador2.getY());

        // Enviar las posiciones de ambos jugadores a todos los suscriptores del lobby
        messagingTemplate.convertAndSend("/topic/movJugador/" + newLobbyId, posiciones);

        System.out.println("Posiciones de los jugadores enviadas para el lobby ID: " + newLobbyId);
    }
}

