package GGTeam.F3API;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Lobby {

    private final Map<String, Boolean> jugadoresListos = new ConcurrentHashMap<>();
    private int contJug = 0;
    private int id;

    public boolean agregarJugador(String jugador) {
        if (contJug < 2) {
            jugadoresListos.put(jugador, false);
            contJug++;
            return true;
        }
        return false;
    }

    public void marcarListo(String jugador) {
        if (jugadoresListos.containsKey(jugador)) {
            jugadoresListos.put(jugador, true);
        }
    }

    public void salirJugador(String jugador) {
        if (jugadoresListos.containsKey(jugador)) {
            jugadoresListos.remove(jugador);
            contJug--;
        }
    }

    public boolean todosListos() {
        return contJug == 2 && jugadoresListos.values().stream().allMatch(Boolean::booleanValue);
    }

    public void setId(int newId) {
        id = newId;
    }

    public int getId() {
        return id;
    }

    public int getNumeroJugadores() {
        return contJug;
    }
    
    public boolean estaVacio() {
    	if(contJug == 0) {
    		return true;
    	}else {
    		return false;
    	}
    }
    	
}