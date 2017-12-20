package xyz.r3alb0t.r3alb0t.common.commands;

import java.util.concurrent.CompletableFuture;

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

	public void execute(MessageCreateEvent e, String[] args) {
		if (e.getMessage().getAuthor().getID() != 104063667351322624l)
			return;

		CompletableFuture<Void> cf = e.getLoader().disconnect(1001);
		cf.thenAcceptAsync(Null -> {
			R3alB0t.logger.info("Disconnected");
		});
		// this.getL
	}
}
