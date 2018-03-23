package xyz.r3alb0t.r3alb0t.music;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.sedmelluq.discord.lavaplayer.track.AudioTrack;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.guild.IGuild;

public class CommandNowPlaying extends Command {

	private List<String> aliases;

	public CommandNowPlaying() {
		super();
		setUnlocalizedName("nowplaying");
		setDescription("Displays the currently playing track");
		aliases = new ArrayList<>();
		aliases.add("np");
	}

	public List<String> getAliases() {
		return aliases;
	}

	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null || !RBMusic.plManagers.containsKey(guild.getID()))
			return;
		PlaylistManager plManager = RBMusic.plManagers.get(guild.getID());
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.setFooter("R3alB0t 2018").setTimestamp(OffsetDateTime.now());
		AudioTrack track = plManager.getPlayingTrack();
		if (track != null) {
			embed.addField("Now Playing", String.format("[%s](%s) - %s", track.getInfo().title, track.getInfo().uri, track.getInfo().author), true);
			embed.addField("Current Time", plManager.getTime(), true);
		} else {
			embed.addField("Now Playing", "N/A", true);
		}
		embed.setThumbnail(!plManager.getVoiceConnection().isPaused() && track != null ? PlaylistManager.playing : PlaylistManager.pause);
		embed.addField("Volume", "Volume: " + plManager.getVoiceConnection().getVolume() + "%", true);
		e.getChannel().sendEmbed(embed);
	}
}
