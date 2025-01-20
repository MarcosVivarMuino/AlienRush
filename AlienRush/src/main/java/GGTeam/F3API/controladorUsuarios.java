package GGTeam.F3API;

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class controladorUsuarios {
	
	List<Usuario> listUsu = buscarLista();
	 // Lista para almacenar los nombres de usuarios conectados
    private final List<String> usuariosConectados = new CopyOnWriteArrayList<>();

    // Endpoint para obtener el número de usuarios conectados
    @GetMapping("/numusuarios")
    public int getUsuariosConectados() {
        return usuariosConectados.size(); // Devuelve el tamaño de la lista
    }

    // Endpoint para agregar un nuevo usuario
    @PostMapping("/numusuarios")
    public void agregarUsuario(@RequestBody String nombreUsuario) {
        if (!usuariosConectados.contains(nombreUsuario)) {
            usuariosConectados.add(nombreUsuario); // Añade el usuario si no está en la lista
            
            // Añadir mensaje al chat
            ChatMessage mensaje = new ChatMessage();
            mensaje.setNombre("Sistema");
            mensaje.setMessage(nombreUsuario + " se ha unido a la sesión.");
            controladorChat.listUsu.add(mensaje);
            
        } else {
            System.out.println("El usuario ya está conectado: " + nombreUsuario);
        }
    }

    // Endpoint para eliminar un usuario
    @PutMapping("/numusuarios")
    public void eliminarUsuario(@RequestBody String nombreUsuario) {
        if (usuariosConectados.remove(nombreUsuario)) { // Elimina el usuario si está en la lista
            System.out.println("Usuario desconectado: " + nombreUsuario);
            // Añadir mensaje al chat
            ChatMessage mensaje = new ChatMessage();
            mensaje.setNombre("Sistema");
            mensaje.setMessage(nombreUsuario + " ha cerrado sesión.");
            controladorChat.listUsu.add(mensaje);
            
        } else {
            System.out.println("El usuario no estaba conectado: " + nombreUsuario);
        }
    }
	
	@GetMapping("/conexion")
    @ResponseBody
    public ResponseEntity<String> checkconexion() {
		return new ResponseEntity<>(HttpStatus.OK);
    }
	
	@PostMapping("/usuarioInicio")
	public ResponseEntity<Usuario> getUsuario(@RequestBody Usuario u) {
	    if (u.getNombre() == null || u.getPassword() == null) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    for (Usuario usuario : listUsu) {
	        if (usuario.getNombre().equals(u.getNombre()) && usuario.getPassword().equals(u.getPassword()) && !usuariosConectados.contains(u.getNombre())) {
	            return new ResponseEntity<>(usuario, HttpStatus.OK); // Usuario encontrado y credenciales correctas
	        }
	    }

	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@GetMapping("/listausuarios")
	public boolean getLista() {
		Usuario aux;
		for(int i =0; i<listUsu.size();i++) {
			aux = listUsu.get(i);
			System.out.println(aux.getNombre());
			System.out.println(aux.getPassword());
		}
		return true;
	}
	
	@PostMapping("/usuario")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Usuario> newUsuario(@RequestBody Usuario u) {
		if(!findUsuario(u.getNombre())){
			listUsu.add(u);
			actuFichero();
			return new ResponseEntity<>(u, HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/usuario")
	public ResponseEntity<Usuario> deleteUsuario(@RequestBody Usuario u){
		boolean usuarioEliminado = false;

	    for (int i = 0; i < listUsu.size(); i++) {
	        Usuario aux = listUsu.get(i);
	        if (aux.getNombre().equals(u.getNombre()) && aux.getPassword().equals(u.getPassword())) {
	            listUsu.remove(i);
	            usuarioEliminado = true;
	            break;
	        }
	    }

	    if (usuarioEliminado) {
	        actuFichero();
	        return new ResponseEntity<>(HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
	
	@PutMapping("/usuario")
	public ResponseEntity<String> actuUsuario(@RequestBody Usuario u) {
	    boolean usuarioActualizado = false;

	    for (Usuario aux : listUsu) {
	        if (aux.getNombre().equals(u.getNombre()) && aux.getPassword().equals(u.getPassword())) {
	            aux.setPassword(u.getNuevaPassword());
	            usuarioActualizado = true;
	            break;
	        }
	    }

	    if (usuarioActualizado) {
	        actuFichero();
	        return new ResponseEntity<>("Contraseña actualizada correctamente.", HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("Usuario no encontrado o contraseña incorrecta.", HttpStatus.NOT_FOUND);
	    }
	}
	
	public void actuFichero() {
        File file = new File("usuarios.txt");

        try (BufferedWriter bw = new BufferedWriter(new FileWriter(file))) {
        	for(int i =0;i<listUsu.size();i++) {
        		bw.write(listUsu.get(i).getNombre());
             	bw.newLine();
             	bw.write(listUsu.get(i).getPassword());
             	bw.newLine();
        	}
        } catch (IOException e) {
            e.printStackTrace();
        }
}
	public boolean findUsuario(String nombre) {
		File file = new File("usuarios.txt");

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            for(int i = 0;i<listUsu.size()*2-1;i++) {
            	line = br.readLine();
            	if(line.equals(nombre)) {
            		return true;
            	}
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
	}
	
	public Usuario buscarUsuario(String nombre) {
		File file = new File("usuarios.txt");
		Usuario aux = new Usuario();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            for(int i = 0;i<listUsu.size()*2-1;i++) {
            	line = br.readLine();
            	if(line.equals(nombre)) {
            		String s1 = line;
            		String s2 = br.readLine();
            		aux.setNombre(s1);
            		aux.setPassword(s2);
            	}
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return aux;
	}
	
	public List<Usuario> buscarLista() {
		File file = new File("usuarios.txt");
		List<Usuario> listAux = new CopyOnWriteArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
            	Usuario aux = new Usuario();
            	String s1 = line;
        		String s2 = br.readLine();
        		aux.setNombre(s1);
        		aux.setPassword(s2);
        		listAux.add(aux);
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
        return listAux;
	}
}