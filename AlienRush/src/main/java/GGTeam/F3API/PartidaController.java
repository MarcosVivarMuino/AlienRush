package GGTeam.F3API;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class PartidaController {

	private final SimpMessagingTemplate messagingTemplate;
	private final Map<Integer, Partida> partidas = new ConcurrentHashMap<>();

	public PartidaController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@MessageMapping("/partida/iniciar")
	public void iniciarPartida(@Payload String payload) {
		if (payload == null || payload.isEmpty()) {
			System.err.println("Error: Payload vacío o nulo.");
			return;
		}

		String[] data = payload.split(",");

		if (data.length != 3) {
			System.err.println("Error: Datos recibidos no válidos. Payload: " + payload);
			return;
		}

		try {
			int lobbyId = Integer.parseInt(data[0]); // El ID del lobby
			String nombreJugador1 = data[1]; // Nombre del jugador 1
			String nombreJugador2 = data[2]; // Nombre del jugador 2

			System.out.println("Lobby ID: " + lobbyId);
			System.out.println("Nombre del Jugador 1: " + nombreJugador1);
			System.out.println("Nombre del Jugador 2: " + nombreJugador2);

			// Crear o recuperar la partida asociada al lobby
			Partida partida = partidas.computeIfAbsent(lobbyId, id -> {
				Partida nuevaPartida = new Partida();
				nuevaPartida.inicializarPartida(lobbyId, nombreJugador1, nombreJugador2);
				System.out.println("Partida registrada con ID: " + lobbyId);
				return nuevaPartida;
			});

			System.out.println("Partida iniciada para el lobby: " + lobbyId);

			messagingTemplate.convertAndSend("/topic/partida/actualizada/" + lobbyId, partida);

		} catch (NumberFormatException e) {
			System.err.println("Error: El ID del lobby no es un número válido.");
		}
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
		}
	}

	@MessageMapping("/movJugador")
	public void actuPosiPlayer(@Payload Map<String, Object> payload) {
		try {
			// Recuperar los datos del payload (ya estructurado como un objeto JSON)
			int newLobbyId = Integer.parseInt(payload.get("lobbyId").toString());
			String tecla = payload.get("tecla").toString();
			String playerName = payload.get("playerName").toString();
			int playerScore = Integer.parseInt(payload.get("playerScore").toString());

			// Buscar la partida asociada al lobbyId
			Partida partida = partidas.get(newLobbyId);

			// Verificar si la partida existe
			if (partida == null) {
				System.out.println("No se encontró la partida con el ID: " + newLobbyId);
				return;
			}

			// Obtener los jugadores
			Jugador jugador1 = partida.getJugador1();
			Jugador jugador2 = partida.getJugador2();

			// Actualizar las posiciones de los jugadores
			if (jugador1.getNombre().equals(playerName)) {
				switch (tecla) {
				case "W":
					jugador1.setYNegativa();
					break;
				case "S":
					jugador1.setYPositiva();
					break;
				case "A":
					jugador1.setXNegativa();
					break;
				case "D":
					jugador1.setXPositiva();
					break;
				}
				jugador1.setScore(playerScore);
			} else if (jugador2.getNombre().equals(playerName)) {
				switch (tecla) {
				case "W":
					jugador2.setYNegativa();
					break;
				case "S":
					jugador2.setYPositiva();
					break;
				case "A":
					jugador2.setXNegativa();
					break;
				case "D":
					jugador2.setXPositiva();
					break;
				}
				jugador2.setScore(playerScore);
			} else {
				System.out.println("Error: No se encontró un jugador con el nombre: " + playerName);
				return;
			}

			// Crear un objeto con las posiciones de los jugadores
			Map<String, Object> posiciones = new HashMap<>();
			posiciones.put("jugador1X", jugador1.getX());
			posiciones.put("jugador1Y", jugador1.getY());
			posiciones.put("jugador2X", jugador2.getX());
			posiciones.put("jugador2Y", jugador2.getY());
			posiciones.put("player1Name", jugador1.getNombre());
			posiciones.put("player2Name", jugador2.getNombre());
			posiciones.put("player1Score", jugador1.getScore());
			posiciones.put("player2Score", jugador2.getScore());
			posiciones.put("playerLife1", partida.getJugador1().getVidas());
			posiciones.put("playerLife2", partida.getJugador2().getVidas());

			// Enviar las posiciones de ambos jugadores a todos los suscriptores del lobby
			messagingTemplate.convertAndSend("/topic/movJugador/" + newLobbyId, posiciones);

		} catch (NumberFormatException e) {
			// Capturar excepciones si no se pueden convertir los datos
			System.out.println("Error: Formato de datos no válido en el payload. " + e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			// Captura general para cualquier otro tipo de error no manejado
			System.out.println("Error inesperado en el método actuPosiPlayer: " + e.getMessage());
			e.printStackTrace();
		}
	}

	@MessageMapping("/actuObjetosIniciales")
	public void actuObjetosIniciales(@Payload Map<String, Object> payload) {
		try {
			// Extraer el lobbyId del payload
			int newLobbyId = Integer.parseInt(payload.get("lobbyId").toString());

			// Buscar la partida en la lista de partidas
			Partida partida = partidas.get(newLobbyId);

			if (partida == null) {
				System.out.println("Error: No se encontró una partida con el ID: " + newLobbyId);
				return;
			}

			// Crear un mapa con las listas de objetos
			Map<String, Object> objetos = new HashMap<>();
			objetos.put("humanos", partida.getHumanos());
			objetos.put("vacas", partida.getVacas());
			objetos.put("militares", partida.getMilitares());
			objetos.put("PUHumanos", partida.getPUHumanos());
			objetos.put("escombros", partida.getEscombros());

			// Enviar las listas de objetos al cliente (o suscriptores)
			messagingTemplate.convertAndSend("/topic/actuObjetosIniciales/" + newLobbyId, objetos);
		} catch (Exception e) {
			// Captura cualquier excepción y muestra el error
			System.out.println("Error inesperado al procesar actuObjetos: " + e.getMessage());
			e.printStackTrace();
		}
	}

	@MessageMapping("/actuObjetos")
	public void actuObjetos(@Payload Map<String, Object> payload) {
		try {
			// Extraer el lobbyId del payload
			int newLobbyId = Integer.parseInt(payload.get("lobbyId").toString());

			// Buscar la partida en la lista de partidas
			Partida partida = partidas.get(newLobbyId);

			if (partida == null) {
				System.out.println("Error: No se encontró una partida con el ID: " + newLobbyId);
				return;
			}

			// Mover objetos aleatoriamente dentro de un rango
			moverObjetos(partida.getHumanos(), 100); // Rango de movimiento 50 para humanos
			moverObjetos(partida.getVacas(), 100); // Rango de movimiento 30 para vacas
			moverObjetos(partida.getMilitares(), 100); // Rango de movimiento 20 para militares
			moverObjetos(partida.getPUHumanos(), 100); // Rango de movimiento 10 para PUHumanos

			// Crear un mapa con las listas de objetos actualizadas
			Map<String, Object> objetos = new HashMap<>();
			objetos.put("humanos", partida.getHumanos());
			objetos.put("vacas", partida.getVacas());
			objetos.put("militares", partida.getMilitares());
			objetos.put("PUHumanos", partida.getPUHumanos());
			objetos.put("escombros", partida.getEscombros());

			// Enviar las listas de objetos al cliente (o suscriptores)
			messagingTemplate.convertAndSend("/topic/actuObjetos/" + newLobbyId, objetos);
		} catch (Exception e) {
			// Captura cualquier excepción y muestra el error
			System.out.println("Error inesperado al procesar actuObjetos: " + e.getMessage());
			e.printStackTrace();
		}
	}

	// Método auxiliar para mover objetos dentro de un rango aleatorio
	private void moverObjetos(Objeto[] objetos, int rango) {
		if (objetos == null)
			return;

		Random random = new Random();
		for (int i = 0; i < objetos.length; i++) {
			Objeto objeto = objetos[i];
			if (objeto != null) {
				// Generar un desplazamiento aleatorio dentro del rango
				float desplazamientoX = -rango + random.nextInt(2 * rango + 1);
				float desplazamientoY = -rango + random.nextInt(2 * rango + 1);

				// Actualizar las posiciones del objeto
				objeto.setX(objeto.getX() + desplazamientoX);
				objeto.setY(objeto.getY() + desplazamientoY);

				// Asegurarse de que las posiciones se mantengan dentro de los límites
				objeto.setX(Math.max(10, Math.min(1700, objeto.getX()))); // Limitar entre 10 y 1700
				objeto.setY(Math.max(20, Math.min(880, objeto.getY()))); // Limitar entre 10 y 1000 (o el rango
																			// vertical deseado)
			}
		}
	}

	@MessageMapping("/actuTime")
	public void actuTime(@Payload Map<String, Object> payload) {
		try {
			// Extraer el lobbyId del payload
			int newLobbyId = Integer.parseInt(payload.get("lobbyId").toString());

			// Buscar la partida en la lista de partidas
			Partida partida = partidas.get(newLobbyId);

			if (partida == null) {
				System.out.println("Error: No se encontró una partida con el ID: " + newLobbyId);
				return;
			}

			int auxTime = partida.getTime();
			auxTime--;
			partida.setTime(auxTime);

			// Enviar las listas de objetos al cliente (o suscriptores)
			messagingTemplate.convertAndSend("/topic/actuTime/" + newLobbyId, auxTime);
		} catch (Exception e) {
			// Captura cualquier excepción y muestra el error
			System.out.println("Error inesperado al procesar actuObjetos: " + e.getMessage());
			e.printStackTrace();
		}
	}

	@MessageMapping("/actuDelete")
	public void actuDelete(@Payload Map<String, Object> payload) {
		try {
			// Extraer el lobbyId del payload
			int lobbyId = Integer.parseInt(payload.get("lobbyId").toString());
			int objetoId = Integer.parseInt(payload.get("objetoId").toString());
			int tipoId = Integer.parseInt(payload.get("tipoId").toString());
			String playerName = payload.get("playerName").toString();
			int playerScore = 0;
			Map<String, Object> posiciones = new HashMap<>();

			// Buscar la partida en la lista de partidas
			Partida partida = partidas.get(lobbyId);

			if (partida == null) {
				System.out.println("Error: No se encontró una partida con el ID: " + lobbyId);
				return;
			}

			if (tipoId == 0) {
				newPos(partida.getHumanos()[objetoId]);
				posiciones.put("PosX", partida.getHumanos()[objetoId].getX());
				posiciones.put("posY", partida.getHumanos()[objetoId].getY());
				posiciones.put("objetoId", objetoId);
				posiciones.put("tipoP", tipoId);
				playerScore = 10;
			} else if (tipoId == 1) {
				newPos(partida.getVacas()[objetoId]);
				posiciones.put("PosX", partida.getVacas()[objetoId].getX());
				posiciones.put("posY", partida.getVacas()[objetoId].getY());
				posiciones.put("objetoId", objetoId);
				posiciones.put("tipoP", tipoId);
				playerScore = 30;
			} else if (tipoId == 2) {
				newPos(partida.getMilitares()[objetoId]);
				posiciones.put("PosX", partida.getMilitares()[objetoId].getX());
				posiciones.put("posY", partida.getMilitares()[objetoId].getY());
				posiciones.put("objetoId", objetoId);
				posiciones.put("tipoP", tipoId);
			} else if (tipoId == 3) {
				if (playerName.equals(partida.getJugador1().getNombre())) {
					partida.getJugador1().setVidas();
				} else if (playerName.equals(partida.getJugador2().getNombre())) {
					partida.getJugador2().setVidas();
				}
				newPos(partida.getEscombros()[objetoId]);
				posiciones.put("PosX", partida.getEscombros()[objetoId].getX());
				posiciones.put("posY", partida.getEscombros()[objetoId].getY());
				posiciones.put("objetoId", objetoId);
				posiciones.put("tipoP", tipoId);
			} else if (tipoId == 4) {
				newPos(partida.getPUHumanos()[objetoId]);
				posiciones.put("PosX", partida.getPUHumanos()[objetoId].getX());
				posiciones.put("posY", partida.getPUHumanos()[objetoId].getY());
				posiciones.put("objetoId", objetoId);
				posiciones.put("tipoP", tipoId);
			}

			if (partida.getJugador1().getNombre() == playerName) {
				partida.getJugador1().setScore(playerScore * partida.getJugador1().getMultiplicador());
			} else if (partida.getJugador2().getNombre() == playerName) {
				partida.getJugador2().setScore(playerScore * partida.getJugador1().getMultiplicador());
			}

			// Enviar las listas de objetos al cliente (o suscriptores)
			messagingTemplate.convertAndSend("/topic/actuDelete/" + lobbyId, posiciones);
		} catch (Exception e) {
			// Captura cualquier excepción y muestra el error
			System.out.println("Error inesperado al procesar actuDelete: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void newPos(Objeto obj) {
		Random random = new Random();

		float randomX = (10 + random.nextFloat() * 1700); // Rango de 0 a 1000 para X
		float randomY = (20 + random.nextFloat() * 880); // Rango de 0 a 1000 para Y
		obj.setX(randomX);
		obj.setY(randomY);
	}
}