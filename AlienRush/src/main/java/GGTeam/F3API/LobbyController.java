package GGTeam.F3API;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import GGTeam.F3API.*;


@Controller
public class LobbyController {

    private final SimpMessagingTemplate messagingTemplate;
    private final List<Lobby> lobbys = new CopyOnWriteArrayList<>();
    private int contLobbys = 0;

    public LobbyController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Crear un nuevo Lobby
    @MessageMapping("/crearLobby")
    @SendTo("/topic/lobbyCreado")
    public Lobby crearLobby(@Payload String user) {
        Lobby newLobby = new Lobby();
        newLobby.agregarJugador(user);
        newLobby.setId(contLobbys);
        contLobbys++;
        lobbys.add(newLobby);

        messagingTemplate.convertAndSend("/topic/lobbyCreado", newLobby);
        return newLobby;
    }

    // Unirse a un lobby existente
    @MessageMapping("/unirseLobby")
    public void unirseLobby(@Payload Map<String, String> payload) {
        String user = payload.get("user");
        int lobbyId = Integer.parseInt(payload.get("lobbyId"));

        Lobby lobby = lobbys.stream()
                .filter(l -> l.getId() == lobbyId)
                .findFirst()
                .orElse(null);

        if (lobby == null) {
            messagingTemplate.convertAndSendToUser(user, "/queue/errors", "Lobby no encontrado");
            return;
        }

        boolean joined = lobby.agregarJugador(user);
        if (joined) {
            messagingTemplate.convertAndSend("/topic/lobbyActualizado/" + lobbyId, lobby);
        } else {
            messagingTemplate.convertAndSendToUser(user, "/queue/errors", "El lobby está lleno");
        }
    }

    // Marcar un jugador como listo
    @MessageMapping("/marcarListo")
    public void marcarListo(@Payload Map<String, String> payload) {
        String user = payload.get("user");
        int lobbyId = Integer.parseInt(payload.get("lobbyId"));

        Lobby lobby = lobbys.stream()
                .filter(l -> l.getId() == lobbyId)
                .findFirst()
                .orElse(null);

        if (lobby == null) {
            messagingTemplate.convertAndSendToUser(user, "/queue/errors", "Lobby no encontrado");
            return;
        }

        lobby.marcarListo(user);
        messagingTemplate.convertAndSend("/topic/lobbyActualizado/" + lobbyId, lobby);

        // Comprobar si todos están listos y notificar para iniciar la partida
        if (lobby.todosListos()) {
            messagingTemplate.convertAndSend("/topic/lobbyListo/" + lobbyId, "Todos los jugadores están listos. ¡Iniciando partida!");
        }
    }

    // Salir de un lobby
    @MessageMapping("/salirLobby")
    public void salirLobby(@Payload Map<String, String> payload) {
        String user = payload.get("user");
        int lobbyId = Integer.parseInt(payload.get("lobbyId"));

        Lobby lobby = lobbys.stream()
                .filter(l -> l.getId() == lobbyId)
                .findFirst()
                .orElse(null);

        if (lobby != null) {
            lobby.salirJugador(user);
            messagingTemplate.convertAndSend("/topic/lobbyActualizado/" + lobbyId, lobby);

            // Eliminar el lobby si está vacío
            if (lobby.estaVacio()) {
                lobbys.remove(lobby);
                messagingTemplate.convertAndSend("/topic/lobbyEliminado", lobbyId);
            }
        } else {
            messagingTemplate.convertAndSendToUser(user, "/queue/errors", "Lobby no encontrado");
        }
    }
}