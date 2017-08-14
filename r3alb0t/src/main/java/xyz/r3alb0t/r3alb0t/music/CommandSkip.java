package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.guild.IGuildMember;

public class CommandSkip extends Command {
	
	public CommandSkip() {
		setUnlocalizedName("skip");
		
	}
	
	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IGuildMember member = e.getMessage().getMember();
		if (member == null) return;
		// if
	}
	
	@Override
	public boolean shouldExecute(IGuildMember member, IGuildTextChannel channel) {
		
		return true;
	}
}
