package GGTeam.F3API;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Lobby {

    private final Map<String, Boolean> jugadoresListos = new ConcurrentHashMap<>();

    // Agregar un jugador al lobby
    public void agregarJugador(String jugador) {
        jugadoresListos.put(jugador, false);
    }

    // Marcar un jugador como listo
    public void marcarListo(String jugador) {
        if (jugadoresListos.containsKey(jugador)) {
            jugadoresListos.put(jugador, true);
        }
    }

    // Verificar si todos los jugadores están listos
    public boolean todosListos() {
        return jugadoresListos.values().stream().allMatch(estado -> estado);
    }}
