package xyz.r3alb0t.r3alb0t.common.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import xyz.r3alb0t.r3alb0t.R3alB0t;

public class CommandTest extends Command {
	public CommandTest() {
		setUnlocalizedName("test");
	}

	public void execute(GuildMessageCreateEvent e, String... args) {
		System.out.println("Does this work?");
	}

	public void execute(MessageCreateEvent e, String[] args) throws Exception {
		if (e.getMessage().getAuthor().getID() != 104063667351322624l)
			return;

		// CompletableFuture<Void> cf = e.getLoader().disconnect(1001);
		// cf.thenAcceptAsync(Null -> {
		e.getChannel().sendMessage("Killing heartbeat for debug").get();
		R3alB0t.logger.info("Killing heartbeat for debug");
		e.getLoader().socket.killHeartbeat();
		// R3alB0t.logger.info("Disconnected");
		// });
		// // this.getL
	}
}
