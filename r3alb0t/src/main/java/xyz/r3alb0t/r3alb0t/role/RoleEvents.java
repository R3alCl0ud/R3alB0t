package xyz.r3alb0t.r3alb0t.role;

import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.GuildMessageCreateEvent;

public class RoleEvents extends EventListenerAdapter {

	@Override
	public void GuildMessageCreate(GuildMessageCreateEvent e) {
		if (e.getMessage().getAuthor().isBot() || !Roles.isGuildEnabled(e.getGuild())) {
			return;
		}
		PlayerJSON player = Roles.getPlayer(e.getGuild(), e.getMessage().getAuthor().getID());
		if (player == null) {
			player = new PlayerJSON(e.getMessage().getAuthor());
		}

		if (System.currentTimeMillis() - player.getLastSpoke() >= 60000l) {
			player.addExp(PlayerUtil.getEXPFromMessage(e.getMessage().getContent()));
		}
		Roles.setPlayer(e.getGuild(), player);
	}

}
