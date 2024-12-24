package GGTeam.F3API;

import java.util.ArrayList;
import java.util.List;

public class Partida {

	// Jugador 1
    private int player1X;
    private int player1Y;
    private int player1Score;

    // Jugador 2
    private int player2X;
    private int player2Y;
    private int player2Score;

    // Objetos en la escena
    private List<Objeto> humanos;
    private List<Objeto> vacas;
    private List<Objeto> militares;
    private List<Objeto> powerUps;

    // Constructor
    public Partida() {
        this.humanos = new ArrayList<>();
        this.vacas = new ArrayList<>();
        this.militares = new ArrayList<>();
        this.powerUps = new ArrayList<>();
    }

    // Getters y Setters para los jugadores
    public int getPlayer1X() { return player1X; }
    public void setPlayer1X(int player1X) { this.player1X = player1X; }

    public int getPlayer1Y() { return player1Y; }
    public void setPlayer1Y(int player1Y) { this.player1Y = player1Y; }

    public int getPlayer1Score() { return player1Score; }
    public void setPlayer1Score(int player1Score) { this.player1Score = player1Score; }

    public int getPlayer2X() { return player2X; }
    public void setPlayer2X(int player2X) { this.player2X = player2X; }

    public int getPlayer2Y() { return player2Y; }
    public void setPlayer2Y(int player2Y) { this.player2Y = player2Y; }

    public int getPlayer2Score() { return player2Score; }
    public void setPlayer2Score(int player2Score) { this.player2Score = player2Score; }

    // Métodos para gestionar los objetos
    public List<Objeto> getHumanos() { return humanos; }
    public void setHumanos(List<Objeto> humanos) { this.humanos = humanos; }

    public List<Objeto> getVacas() { return vacas; }
    public void setVacas(List<Objeto> vacas) { this.vacas = vacas; }

    public List<Objeto> getMilitares() { return militares; }
    public void setMilitares(List<Objeto> militares) { this.militares = militares; }

    public List<Objeto> getPowerUps() { return powerUps; }
    public void setPowerUps(List<Objeto> powerUps) { this.powerUps = powerUps; }

    // Método para actualizar posiciones de los objetos
    public void actualizarObjeto(List<Objeto> listaObjetos, int index, int x, int y) {
        if (index >= 0 && index < listaObjetos.size()) {
            Objeto objeto = listaObjetos.get(index);
            objeto.setX(x);
            objeto.setY(y);
        }
    }

    // Clase interna para los objetos
    public static class Objeto {
        private int x;
        private int y;

        public Objeto(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() { return x; }
        public void setX(int x) { this.x = x; }

        public int getY() { return y; }
        public void setY(int y) { this.y = y; }
    }
}
