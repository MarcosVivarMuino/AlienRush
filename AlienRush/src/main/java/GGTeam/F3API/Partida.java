package GGTeam.F3API;

import java.util.ArrayList;
import java.util.List;

public class Partida {

    private int id;
    private boolean pausa;

    // Datos de los jugadores
    private Jugador jugador1;
    private Jugador jugador2;

    // Objetos en la escena
    private List<Objeto> humanos = new ArrayList<>();
    private List<Objeto> vacas = new ArrayList<>();
    private List<Objeto> militares = new ArrayList<>();
    private List<Objeto> PUHumanos = new ArrayList<>();
    private List<Objeto> escombros = new ArrayList<>();

    // Constructor
    public Partida() {
        this.jugador1 = new Jugador();
        this.jugador2 = new Jugador();
        this.pausa = false;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public boolean isPausa() { return pausa; }
    public void setPausa(boolean pausa) { this.pausa = pausa; }

    public Jugador getJugador1() { return jugador1; }
    public void setJugador1(Jugador jugador1) { this.jugador1 = jugador1; }

    public Jugador getJugador2() { return jugador2; }
    public void setJugador2(Jugador jugador2) { this.jugador2 = jugador2; }

    public List<Objeto> getHumanos() { return humanos; }
    public void setHumanos(List<Objeto> humanos) { this.humanos = humanos; }

    public List<Objeto> getVacas() { return vacas; }
    public void setVacas(List<Objeto> vacas) { this.vacas = vacas; }

    public List<Objeto> getMilitares() { return militares; }
    public void setMilitares(List<Objeto> militares) { this.militares = militares; }

    public List<Objeto> getPUHumanos() { return PUHumanos; }
    public void setPUHumanos(List<Objeto> PUHumanos) { this.PUHumanos = PUHumanos; }

    public List<Objeto> getEscombros() { return escombros; }
    public void setEscombros(List<Objeto> escombros) { this.escombros = escombros; }

    // Inicializar la partida
    public void inicializarPartida(int id, String nombreJugador1, String nombreJugador2,
                                   List<Objeto> humanos, List<Objeto> vacas, List<Objeto> militares,
                                   List<Objeto> PUHumanos, List<Objeto> escombros) {
        this.id = id;
        this.jugador1.inicializar(nombreJugador1, this.id);
        this.jugador2.inicializar(nombreJugador2, this.id);
        this.jugador1.setX(200);
        this.jugador1.setY(600);
        this.jugador2.setX(1550);
        this.jugador2.setY(600);

        this.humanos = (humanos != null) ? humanos : new ArrayList<>();
        this.vacas = (vacas != null) ? vacas : new ArrayList<>();
        this.militares = (militares != null) ? militares : new ArrayList<>();
        this.PUHumanos = (PUHumanos != null) ? PUHumanos : new ArrayList<>();
        this.escombros = (escombros != null) ? escombros : new ArrayList<>();

        this.pausa = false;
    }

    // Mover objetos
    public void moverObjetos() {
        moverListaObjetos(humanos, 100, 100);
        moverListaObjetos(vacas, 150, 150);
        moverListaObjetos(militares, 80, 80);
        moverListaObjetos(PUHumanos, 100, 100);
        moverListaObjetos(escombros, 120, 120);
    }

    private void moverListaObjetos(List<Objeto> objetos, int deltaX, int deltaY) {
        for (Objeto objeto : objetos) {
            moverObjetoAleatoriamente(objeto, deltaX, deltaY, 80, 1680, 80, 800);
        }
    }

    private void moverObjetoAleatoriamente(Objeto objeto, int deltaX, int deltaY, int minX, int maxX, int minY, int maxY) {
        int nuevaX = objeto.getX() + (int) (Math.random() * (2 * deltaX + 1)) - deltaX;
        int nuevaY = objeto.getY() + (int) (Math.random() * (2 * deltaY + 1)) - deltaY;

        objeto.setX(Math.max(minX, Math.min(nuevaX, maxX)));
        objeto.setY(Math.max(minY, Math.min(nuevaY, maxY)));
    }

    // Actualizar la partida
    public void actualizarPartida(Partida nuevaPartida) {
        this.jugador1.actualizar(nuevaPartida.getJugador1());
        this.jugador2.actualizar(nuevaPartida.getJugador2());
        this.humanos = nuevaPartida.getHumanos();
        this.vacas = nuevaPartida.getVacas();
        this.militares = nuevaPartida.getMilitares();
        this.PUHumanos = nuevaPartida.getPUHumanos();
        this.escombros = nuevaPartida.getEscombros();
    }
}