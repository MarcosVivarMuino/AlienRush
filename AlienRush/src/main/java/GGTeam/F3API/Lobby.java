package GGTeam.F3API;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.swing.text.html.HTMLDocument.Iterator;

public class Lobby {

    private final Map<String, Boolean> jugadoresListos = new ConcurrentHashMap<>();
    private String player1;  // Aquí debe ser solo el nombre del jugador, no un objeto
    private String player2;  // Lo mismo para el segundo jugador
    private boolean player1Listo = false;
    private boolean player2Listo = false;
    private int contJug = 0;
    private int id;
    private boolean todosListos = false;

    public boolean agregarJugador(String jugador) {
        if (contJug == 0) {
            player1 = jugador;  // Asignamos el nombre del primer jugador
        } else if (contJug == 1) {
            player2 = jugador;  // Asignamos el nombre del segundo jugador
        }

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
            if (jugador.equals(player1)) {
                player1Listo = true;
            } else if (jugador.equals(player2)) {
                player2Listo = true;
            }
        }
        isTodosListos();
    }


    public void salirJugador(String jugador) {
        if (jugadoresListos.containsKey(jugador)) {
            jugadoresListos.remove(jugador);
            if (jugador.equals(player1)) {
                player1 = null;
                player1Listo = false;
            } else if (jugador.equals(player2)) {
                player2 = null;
                player2Listo = false;
            }
            contJug--;
        }
    }

    public void setId(int newId) {
        id = newId;
    }

    public int getId() {
        return id;
    }
    
    public boolean isPlayer1Listo() {
        return player1Listo;
    }

    public boolean isPlayer2Listo() {
        return player2Listo;
    }
    
    public boolean isTodosListos() {
    	if(contJug == 2 && player1Listo == true && player2Listo == true) {
            todosListos = true;
            }
        return todosListos;
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
    
    public void setPlayer1Name(String name) {
    	player1 = name;
    }

    public void setPlayer2Name(String name) {
        player2 = name;
    }
    
    
    public boolean estaVacio() {
        return contJug == 0;
    }
}