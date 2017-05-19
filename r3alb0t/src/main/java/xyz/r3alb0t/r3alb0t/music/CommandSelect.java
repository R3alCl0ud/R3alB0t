package xyz.r3alb0t.r3alb0t.music;

import io.discloader.discloader.client.command.Command;

/**
 * @author Perry Berman
 *
 */
public class CommandSelect extends Command {
	
	public CommandSelect() {
		setUnlocalizedName("select");
		setDescription("adds a track/set to the playlist\nCurrently only works with YouTube");
	}
	
}
