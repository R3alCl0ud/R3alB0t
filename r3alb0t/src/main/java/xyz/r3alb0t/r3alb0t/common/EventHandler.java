package xyz.r3alb0t.r3alb0t.common;

import com.neovisionaries.ws.client.WebSocketFrame;

import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.RawEvent;
import io.discloader.discloader.common.event.ReadyEvent;
import xyz.r3alb0t.r3alb0t.music.RBMusic;

public class EventHandler extends EventListenerAdapter {

	@Override
	public void RawPacket(RawEvent data) {
		if (data.isGateway()) {
			WebSocketFrame frame = data.getFrame();
			if (frame.isTextFrame()) System.out.println(frame.getPayloadText());
		}
	}

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
