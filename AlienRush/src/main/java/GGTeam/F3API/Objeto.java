package GGTeam.F3API;

//Clase interna para objetos
public class Objeto {
    private float x;
    private float y;
    private int id;

    public Objeto(float x, float y) {
        this.x = x;
        this.y = y;
    }
    
    public Objeto() {}

    public float getX() { return x; }
    public void setX(float x) { this.x = x; }

    public float getY() { return y; }
    public void setY(float y) { this.y = y; }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
}
