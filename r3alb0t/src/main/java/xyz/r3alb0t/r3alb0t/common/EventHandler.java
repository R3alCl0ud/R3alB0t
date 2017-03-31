package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.ReadyEvent;
import xyz.r3alb0t.r3alb0t.music.RBMusic;

public class EventHandler extends EventListenerAdapter {
	
	@Override
	public void PreInit(DLPreInitEvent e) {
		System.out.println("Registering music commands");
		RBMusic.registerCommands();
	}
	
	@Override
	public void Ready(ReadyEvent event) {
		event.loader.user.setGame("Converting to DiscLoader");
	}
	
}
