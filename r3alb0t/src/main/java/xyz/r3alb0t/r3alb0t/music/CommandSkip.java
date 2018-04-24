package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;

public class CommandSkip extends Command {

	public CommandSkip() {
		setUnlocalizedName("skip");
		setDescription("Skips the currently playing song, if there is one.");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IGuildMember member = e.getMessage().getMember();
		IGuild guild = e.getMessage().getGuild();
		if (guild == null || RBMusic.plManagers.get(guild.getID()) == null || member == null || member.getVoiceChannel() == null) {
			return;
		}
		RBMusic.plManagers.get(guild.getID()).skip();
	}

	@Override
	public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {

		return true;
	}
}
