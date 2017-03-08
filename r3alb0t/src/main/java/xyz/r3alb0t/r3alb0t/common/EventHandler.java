package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.common.DiscLoader;
import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import xyz.r3alb0t.r3alb0t.music.RBMusic;

public class EventHandler extends EventListenerAdapter {

	
	public void PreInit(DLPreInitEvent e) {
		System.out.println("Registering music commands");
		RBMusic.registerCommands();
	}

	public void Ready(DiscLoader loader) {
		loader.user.setGame("Converting to DiscLoader");
	}

}
