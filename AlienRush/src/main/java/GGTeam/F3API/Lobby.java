package GGTeam.F3API;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.swing.text.html.HTMLDocument.Iterator;

public class Lobby {

    private final Map<String, Boolean> jugadoresListos = new ConcurrentHashMap<>();
    private String player1;  // Aquí debe ser solo el nombre del jugador, no un objeto
    private String player2;  // Lo mismo para el segundo jugador
    private int contJug = 0;
    private int id;

    public boolean agregarJugador(String jugador) {
        if (contJug == 0) {
            player1 = jugador;  // Asignamos el nombre del primer jugador
        } else if (contJug == 1) {
            player2 = jugador;  // Asignamos el nombre del segundo jugador
        }

        if (contJug < 3) {
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
    
    public String getPlayer1Name() {
        return (player1 != null) ? player1 : "Esperando...";  // Devolvemos el nombre directamente
    }

    public String getPlayer2Name() {
        return (player2 != null) ? player2 : "Esperando...";  // Devolvemos el nombre directamente
    }
    
    public boolean estaVacio() {
        return contJug == 0;
    }
}