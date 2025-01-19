package GGTeam.F3API;

//Clase interna para objetos
public class Objeto {
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
