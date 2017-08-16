package xyz.r3alb0t.r3alb0t.common;

import com.neovisionaries.ws.client.WebSocketFrame;

import io.discloader.discloader.common.Shard;
import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.IEventListener;
import io.discloader.discloader.common.event.RawEvent;
import io.discloader.discloader.common.event.ReadyEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.currency.CurrencyEvents;
import xyz.r3alb0t.r3alb0t.custom.CommandEvents;
import xyz.r3alb0t.r3alb0t.custom.CustomCommands;
import xyz.r3alb0t.r3alb0t.logs.LogHandler;
import xyz.r3alb0t.r3alb0t.util.DataBase;

public class EventHandler extends EventListenerAdapter {

	private Shard shard;
	private static boolean registered = false;
	private static IEventListener currency, ccmds;

	public EventHandler(Shard shard) {
		this.shard = shard;
	}

	@Override
	public void PreInit(DLPreInitEvent e) {
		R3alB0t.logger.info("Registering music commands");
		Commands.registerCommands();
		LogHandler.load();
		DataBase.getDataBase().connect();

	}

	@Override
	public void Ready(ReadyEvent event) {
		if (!registered) {
			R3alB0t.logger.info("Registering music commands");
			Commands.registerCommands();
			LogHandler.load();
			if (!DataBase.getDataBase().isConnected()) DataBase.getDataBase().connect();
			Currency.load();
			currency = new CurrencyEvents();
			ccmds = new CommandEvents();
		}
		event.getLoader().addEventHandler(currency);
		event.getLoader().addEventHandler(ccmds);
		// event.getLoader().user.setGame("Testing all the things");
		R3alB0t.logger.info("Ready on shard: " + shard.getShardID());
		R3alB0t.logger.info("Shard connected to " + EntityRegistry.getGuildsOnShard(shard).size() + " guild(s)");
		if (!registered) {
			registered = true;
			CustomCommands.loadCommands();
		}
	}

	@Override
	public void RawPacket(RawEvent data) {
		WebSocketFrame frame = data.getFrame();
		if (data.isGateway() && frame.isTextFrame() && !frame.getPayloadText().contains("PRESENCE_UPDATE")) {
			// R3alB0t.logger.info(frame.getPayloadText());
		} else if (data.isREST() && data.getHttpResponse() != null && data.getHttpResponse().getBody() != null) {
			R3alB0t.logger.info(data.getHttpResponse().getBody());
		}
	}
}
