package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.common.Shard;
import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.ReadyEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.logs.LogHandler;

public class EventHandler extends EventListenerAdapter {
	
	private Shard shard;
	private static boolean registered = false;
	
	public EventHandler(Shard shard) {
		this.shard = shard;
	}
	
	@Override
	public void PreInit(DLPreInitEvent e) {
		R3alB0t.logger.info("Registering music commands");
		Commands.registerCommands();
		LogHandler.load();
	}
	
	@Override
	public void Ready(ReadyEvent event) {
		if (!registered) {
			R3alB0t.logger.info("Registering music commands");
			Commands.registerCommands();
			LogHandler.load();
			registered = true;
		}
		event.getLoader().user.setGame("R3alB0t: The Next Generation");
		R3alB0t.logger.info("Ready");
		R3alB0t.logger.info("Shard connected to " + EntityRegistry.getGuildsOnShard(shard).size() + " guild(s)");
	}
	
}
