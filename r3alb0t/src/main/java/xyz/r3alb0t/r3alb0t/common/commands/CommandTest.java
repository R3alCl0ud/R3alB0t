package xyz.r3alb0t.r3alb0t.common.commands;

import java.util.concurrent.CompletableFuture;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import xyz.r3alb0t.r3alb0t.common.LogHandler;

public class CommandTest extends Command {
	public CommandTest() {
		setUnlocalizedName("test");
	}

	public void execute(GuildMessageCreateEvent e, String... args) {
		System.out.println("Does this work?");
	}

	public void execute(MessageCreateEvent e, String[] args) throws Exception {
		if (e.getMessage().getAuthor().getID() != 104063667351322624l || e.getMessage().getGuild() == null || e.getMessage().getGuild().getID() != 282226852616077312l) {
			return;
		}
		IGuild guild = e.getMessage().getGuild();

		CompletableFuture<IGuildMember> future = guild.getMember(261242790946537473l).kick("Is this thing working?");
		future.thenAcceptAsync(gm -> {
			e.getChannel().sendMessage("Success");
		});
		future.exceptionally(ex -> {
			LogHandler.throwing(ex);
			e.getChannel().sendMessage("Failed");
			return null;
		});
	}
}
