package GGTeam.F3API;

import GGTeam.F3API.Partida;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class WebSocketController {

	  private final SimpMessagingTemplate messagingTemplate;

	    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
	        this.messagingTemplate = messagingTemplate;
	    }

	    // Actualizar toda la partida
	    @MessageMapping("/actualizarPartida")
	    @SendTo("/topic/actualizarPartida")
	    public Partida actualizarPartida(@Payload Partida partida, SimpMessageHeaderAccessor headerAccessor) {
	        String sessionId = headerAccessor.getSessionId();
	        actualizarJugador(partida, sessionId);
	        return partida;
	    }

	    // Actualizar la posición de los jugadores
	    @MessageMapping("/actualizarPosiciones")
	    @SendTo("/topic/actualizarPosiciones")
	    public Partida actualizarPosiciones(@Payload Partida partida, SimpMessageHeaderAccessor headerAccessor) {
	        String sessionId = headerAccessor.getSessionId();
	        actualizarJugador(partida, sessionId);
	        return partida;
	    }

	    // Actualizar los puntos de los jugadores
	    @MessageMapping("/actualizarPuntos")
	    @SendTo("/topic/actualizarPuntos")
	    public Partida actualizarPuntos(@Payload Partida partida, SimpMessageHeaderAccessor headerAccessor) {
	        String sessionId = headerAccessor.getSessionId();
	        actualizarJugador(partida, sessionId);
	        return partida;
	    }

	    // Actualizar las posiciones de los objetos
	    @MessageMapping("/actualizarObjetos")
	    @SendTo("/topic/actualizarObjetos")
	    public Partida actualizarObjetos(@Payload Partida partida, SimpMessageHeaderAccessor headerAccessor) {
	        return partida;
	    }

	    private void actualizarJugador(Partida partida, String sessionId) {
	        if (sessionId.equals(partida.getJugador1Id())) {
	            partida.actualizarJugador1();
	        } else if (sessionId.equals(partida.getJugador2Id())) {
	            partida.actualizarJugador2();
	        }
	    }
    
}
