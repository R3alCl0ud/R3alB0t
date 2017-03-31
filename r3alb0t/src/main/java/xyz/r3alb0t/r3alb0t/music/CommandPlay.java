package xyz.r3alb0t.r3alb0t.music;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.message.IMessage;

public class CommandPlay extends Command {
    public CommandPlay() {
        setUnlocalizedName("play");
        setDescription("adds a track/set to the playlist\nCurrently only works with YouTube");
    }

    private final String regex = "\\#\\$play[ ](.*)";
    private final Pattern pattern = Pattern.compile(regex);

    @Override
	public void execute(MessageCreateEvent e, String[] args) {
		IMessage message = e.getMessage();
		if (message.getGuild() != null && e.loader.voiceConnections.containsKey(message.getGuild().getID())) {
			Matcher track = pattern.matcher(message.getContent());
            if (track.find()) {
                String trackID = track.group(1);
                System.out.println(trackID);
				e.loader.voiceConnections.get(message.getGuild().getID()).play(trackID);
            }
        } else {
        }
    }
}
