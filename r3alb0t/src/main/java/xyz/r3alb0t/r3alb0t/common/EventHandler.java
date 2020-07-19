package xyz.r3alb0t.r3alb0t.common;

import com.neovisionaries.ws.client.WebSocketFrame;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.Shard;
import io.discloader.discloader.common.event.DLPreInitEvent;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.IEventListener;
import io.discloader.discloader.common.event.RawEvent;
import io.discloader.discloader.common.event.ReadyEvent;
import io.discloader.discloader.common.event.guild.GuildCreateEvent;
import io.discloader.discloader.common.event.guild.GuildDeleteEvent;
import io.discloader.discloader.common.registry.EntityRegistry;
import io.discloader.discloader.core.entity.message.embed.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import xyz.r3alb0t.r3alb0t.R3alB0t;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.currency.CurrencyEvents;
import xyz.r3alb0t.r3alb0t.custom.CommandEvents;
import xyz.r3alb0t.r3alb0t.custom.CustomCommands;
import xyz.r3alb0t.r3alb0t.logs.LogEventHandler;
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
		LogEventHandler.load();
		DataBase.getClient().connect();

	}

	@Override
	public void Ready(ReadyEvent event) {
		if (!registered) {
			R3alB0t.logger.info("Starting DataBase connection if not already connected");
			if (DataBase.getClient() == null || !DataBase.getClient().isConnected())
				DataBase.connect();
			R3alB0t.logger.info("Registering music commands");
			Commands.registerCommands();
			LogEventHandler.load();
			Currency.load();
			currency = new CurrencyEvents();
			ccmds = new CommandEvents();
			CustomCommands.loadCommands();
			registered = true;
		}
		event.getLoader().addEventListener(currency);
		event.getLoader().addEventListener(ccmds);
		event.getLoader().getSelfUser().setGame(CommandHandler.prefix + "help || " + CommandHandler.prefix + "invite");
		R3alB0t.logger.info("Ready on shard: " + shard.getShardID());
		R3alB0t.logger.info("Shard connected to " + EntityRegistry.getGuildsOnShard(shard).size() + " guild(s)");
		for (IGuild guild : EntityRegistry.getGuildsOnShard(shard)) {
			DataBase.getClient().sadd("guilds", SnowflakeUtil.asString(guild));
		}
	}

	@Override
	public void GuildCreate(GuildCreateEvent e) {
		ITextChannel logChannel = EntityRegistry.getTextChannelByID(228370138645266432l);
		if (logChannel == null)
			return;
		RichEmbed embed = new RichEmbed("Guild Joined");
		embed.setTimestamp().addField("Guild Name", e.getGuild().getName(), true).setColor(0x00df70);
		embed.addField("Total Guilds", String.format("%d guild(s) across %d shard(s)", EntityRegistry.getGuilds().size(), e.getLoader().getShard().getShardCount()), true);
		DataBase.getClient().sadd("guilds", SnowflakeUtil.asString(e.getGuild()));
		logChannel.sendEmbed(embed);
	}

	@Override
	public void GuildDelete(GuildDeleteEvent e) {
		ITextChannel logChannel = EntityRegistry.getTextChannelByID(228370138645266432l);
		if (logChannel == null)
			return;
		RichEmbed embed = new RichEmbed("Guild Left");
		embed.setTimestamp().addField("Guild Name", e.getGuild().getName(), true).setColor(0xFF0000);
		embed.addField("Total Guilds", String.format("%d guild(s) across %d shard(s)", EntityRegistry.getGuilds().size(), e.getLoader().getShard().getShardCount()), true);
		DataBase.getClient().srem("guilds", SnowflakeUtil.asString(e.getGuild()));
		logChannel.sendEmbed(embed);
	}

	@Override
	public void RawPacket(RawEvent data) {
		WebSocketFrame frame = data.getFrame();
		if (shard.getLoader().getOptions().isDebugging()) {
			if (data.isGateway() && frame.isTextFrame() && !frame.getPayloadText().contains("PRESENCE_UPDATE") && !frame.getPayloadText().contains("GUILD_CREATE") && !frame.getPayloadText().contains("READY")) {
				R3alB0t.logger.config(frame.getPayloadText());
			} else if (data.isREST() && data.getHttpResponse() != null && data.getHttpResponse().getBody() != null) {
				R3alB0t.logger.config(data.getHttpResponse().getBody());
			}
		}
	}
}
