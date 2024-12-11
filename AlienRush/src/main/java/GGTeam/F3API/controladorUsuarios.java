package GGTeam.F3API;

import java.util.concurrent.CopyOnWriteArrayList;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class controladorUsuarios {
	
	List<Usuario> listUsu = buscarLista();
	
	@GetMapping("api/getIp")
    @ResponseBody
    public String getServerIp() {
        try {
            // Obtiene la dirección IP del servidor
            InetAddress inetAddress = InetAddress.getLocalHost();
            String serverIp = inetAddress.getHostAddress();
            System.out.println(inetAddress);
            return serverIp;
        } catch (UnknownHostException e) {
            e.printStackTrace();
            return "No se pudo obtener la dirección IP del servidor.";
        }
    }
	
	@PostMapping("/usuarioInicio")
	public ResponseEntity<Usuario> getUsuario(@RequestBody Usuario u) {
	    if (u.getNombre() == null || u.getPassword() == null) {
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }

	    for (Usuario usuario : listUsu) {
	        if (usuario.getNombre().equals(u.getNombre()) && usuario.getPassword().equals(u.getPassword())) {
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
	
	@DeleteMapping("/usuario/{nombre}")
	public ResponseEntity<Usuario> deleteUsuario(@PathVariable("nombre") String nombre){
		boolean usuarioEliminado = false;

	    for (int i = 0; i < listUsu.size(); i++) {
	        Usuario aux = listUsu.get(i);
	        if (aux.getNombre().equals(nombre)) {
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
	
	@PutMapping("/usuario/{nombre}")
	public ResponseEntity<String> actuUsuario(@PathVariable("nombre") String nombre, @RequestBody Usuario u) {
	    boolean usuarioActualizado = false;

	    for (Usuario aux : listUsu) {
	        if (aux.getNombre().equals(nombre) && aux.getPassword().equals(u.getPassword())) {
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