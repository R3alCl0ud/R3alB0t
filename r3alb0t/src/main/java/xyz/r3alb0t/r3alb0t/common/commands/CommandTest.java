package xyz.r3alb0t.r3alb0t.common.commands;

import java.util.concurrent.CompletableFuture;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.channel.IGuildChannel;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuild;

public class CommandTest extends Command {
	public CommandTest() {
		setUnlocalizedName("test");
	}

	public void execute(GuildMessageCreateEvent e, String... args) {
		System.out.println("Does this work?");
	}
	
	public void execute(MessageCreateEvent e, String[] args) {
		if (e.getMessage().getGuild() == null)
			return;
		try {
			IGuild guild = e.getMessage().getGuild();
			System.out.println(guild.getID());
			if (guild.getID() != 282226852616077312l)
				return;
			System.out.println("Hmm");
			IGuildTextChannel channel = ((IGuildTextChannel) e.getChannel());
			CompletableFuture<IGuildChannel> cf = channel.setPosition(-1);
			cf.thenAcceptAsync(nc -> {
				((IGuildTextChannel) nc).sendMessage("Success!");
			});
			cf.exceptionally(ex -> {
				String msg = String.format("Failed: %s\nreason: %s", ex.getClass().getName(), ex.getMessage());
				channel.sendMessage(msg);
				return null;
			});
			// IGuildMember william = guild.getMember(104063667351322624l);
			// if (william == null)
			// return;
			//
			// CompletableFuture<IGuildMember> future =
			// william.takeRole(guild.getRoleByID(282227170443526144l));
			// future.thenAcceptAsync(mem -> {
			// if (mem != null)
			// e.getChannel().sendMessage("Success");
			// });
			// future.exceptionally(ex -> {
			// e.getChannel().sendMessage("Failed");
			// ex.printStackTrace();
			// return null;
			// });

		} catch (Exception ex) {
			String msg = String.format("Failed: %s\nreason: %s", ex.getClass().getName(), ex.getMessage());
			e.getChannel().sendMessage(msg);
			ex.printStackTrace();
		}
	}
}
