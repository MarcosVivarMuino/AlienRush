package GGTeam.F3API;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Controller
public class PartidaController {
	private final List<Partida> partidas = new CopyOnWriteArrayList<>();

	@MessageMapping("/update")
	@SendTo("/topic/positions")
	public Partida actualizarPartida(Partida partida) {
	    // Obtener el ID de la partida a actualizar
	    int idPartida = partida.getId();

	    // Buscar la partida existente en la lista
	    Partida partidaExistente = partidas.stream()
	            .filter(p -> p.getId() == idPartida)
	            .findFirst()
	            .orElse(null);

	    if (partidaExistente == null) {
	        throw new IllegalStateException("La partida con ID " + idPartida + " no existe.");
	    }

	    // Actualizar los atributos de la partida existente
	    partidaExistente.setPlayer1X(partida.getPlayer1X());
	    partidaExistente.setPlayer1Y(partida.getPlayer1Y());
	    partidaExistente.setPlayer1Score(partida.getPlayer1Score());
	    partidaExistente.setPlayer1Vidas(partida.getPlayer1Vidas());
	    partidaExistente.setPlayer1Speed(partida.getPlayer1Speed());
	    partidaExistente.setPlayer1Size(partida.getPlayer1Size());
	    partidaExistente.setPlayer1Multiplicador(partida.getPlayer1Multiplicador());
	    partidaExistente.setPlayer1CantPU(partida.getPlayer1CantPU());
	    partidaExistente.setPlayer1Nombre(partida.getPlayer1Nombre());

	    partidaExistente.setHumanos(partida.getHumanos());
	    partidaExistente.setVacas(partida.getVacas());
	    partidaExistente.setMilitares(partida.getMilitares());
	    partidaExistente.setPUHumanos(partida.getPUHumanos());
	    partidaExistente.setEscombros(partida.getEscombros());

	    partidaExistente.setPausa(partida.isPausa());

	    // Actualizar objetos en movimiento
	    partidaExistente.moverObjetos();

	    // Devolver el estado actualizado de la partida
	    return partidaExistente;
	}

    @MessageMapping("/start")
    @SendTo("/topic/start")
    public Partida iniciarPartida(int idPartida) {
        // Buscar la partida en la lista
        Partida partida = partidas.stream()
                .filter(p -> p.getId() == idPartida)
                .findFirst()
                .orElse(null);

        if (partida == null) {
            // Crear nueva partida si no existe
            partida = new Partida();
            partida.setId(idPartida);
            partidas.add(partida); // Agregar la nueva partida a la lista
        }

        return partida;
    }
        
           
}
