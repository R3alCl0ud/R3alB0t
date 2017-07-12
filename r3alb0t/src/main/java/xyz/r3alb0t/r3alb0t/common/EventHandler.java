package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.ReadyEvent;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.logs.LogHandler;

public class EventHandler extends EventListenerAdapter {

	@Override
	public void PreInit(DLPreInitEvent e) {
		R3alB0t.logger.info("Registering music commands");
		Commands.registerCommands();
		LogHandler.load();
	}

	@Override
	public void Ready(ReadyEvent event) {
		event.getLoader().user.setGame("R3alB0t: The Next Generation");
		R3alB0t.logger.info("Ready");
	}

}
