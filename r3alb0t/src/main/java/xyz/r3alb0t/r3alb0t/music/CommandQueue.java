package xyz.r3alb0t.r3alb0t.music;

import java.util.List;

import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.core.entity.message.embed.RichEmbed;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.message.IMessage;
import xyz.r3alb0t.r3alb0t.R3alB0t;

public class CommandQueue extends Command {

	public CommandQueue() {
		setUnlocalizedName("queue");
		setDescription("Displays the current queue of songs, if there is any songs in the queue.");
		setArgsRegex("(\\d+)");
	}

	@Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		IGuild guild = message.getGuild();
		ITextChannel channel = message.getChannel();
		int page = 1;
		if (args.length >= 1 && args[0] != null) {
			page = Integer.parseInt(args[0], 10);
		}
		if (guild != null && RBMusic.plManagers.containsKey(guild.getID())) {
			PlaylistManager plManager = RBMusic.plManagers.get(guild.getID());
			List<AudioTrack> tracks = plManager.getTracks();
			RichEmbed embed = new RichEmbed("Queue").setDescription("The current playlist").setColor(0x2566C7);
			embed.setFooter(R3alB0t.getCopyrightInfo()).setTimestamp();
			for (int i = 10 * (page - 1); i < 10 * page && i < tracks.size(); i++) {
				AudioTrackInfo info = tracks.get(i).getInfo();
				try {
					embed.addField("" + (i + 1), String.format("[%s](%s) `[%s]` by %s", info.title, info.uri, plManager.getLength(tracks.get(i)), info.author));
				} catch (Exception e1) {
					e1.printStackTrace();
				}
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
