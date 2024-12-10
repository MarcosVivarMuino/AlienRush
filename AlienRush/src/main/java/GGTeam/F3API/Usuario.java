package GGTeam.F3API;

public class Usuario {
	
	private String nombre;
	private String password;
	
	Usuario(){
		
	}
	
	Usuario(String nombre, String password){
		this.nombre = nombre;
		this.password = password;
	}
	
	public String getNombre() {
		return nombre;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setNombre(String n) {
		nombre = n;
	}
	
	public void setPassword(String n) {
		password = n;
	}
}
