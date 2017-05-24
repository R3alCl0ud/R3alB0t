package xyz.r3alb0t.r3alb0t.music;

import java.time.OffsetDateTime;
import java.util.List;

import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;

public class CommandQueue extends Command {

	public CommandQueue() {
		setUnlocalizedName("queue");
		setDescription("adds a track/set to the playlist\nCurrently only works with YouTube");
		setArgsRegex("(\\d+?)");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		ITextChannel channel = message.getChannel();
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) {
			PlaylistManager plManager = RBMusic.plManagers.get(guild.getID());
			List<AudioTrack> tracks = plManager.getTracks();
			RichEmbed embed = new RichEmbed("Queue").setDescription("The current playlist").setColor(0x2566C7);
			embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
			for (int i = 0; i < 10 && i < tracks.size(); i++) {
				AudioTrackInfo info = tracks.get(i).getInfo();
				embed.addField("" + (i + 1), String.format("[%s](%s) by %s", info.title, info.uri, info.author));
			}
			long tr = plManager.getLength();
			if (plManager.getPlayingTrack() != null) {
				tr -= (plManager.getPlayingTrack().getPosition() / 1000l);
			}
			embed.addField("Tracks Remaining", "" + tracks.size(), true);
			embed.addField("Time Remaining", String.format("%02d:%02d", tr / 60l, tr % 60l), true);
			channel.sendEmbed(embed);
		}
	}
}
