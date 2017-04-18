package xyz.r3alb0t.r3alb0t.music;

import java.util.HashMap;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.registry.CommandRegistry;

public class RBMusic {

	public static HashMap<Long, PlaylistManager> plManagers = new HashMap<>();

	public static Command join;
	public static Command play;
	public static Command volume;
	public static Command pause;
	public static Command leave;
	public static Command shuffle;

	public static void registerCommands() {
		CommandRegistry.registerCommand(join = new CommandJoin(), join.getUnlocalizedName());
		CommandRegistry.registerCommand(play = new CommandPlay(), play.getUnlocalizedName());
		CommandRegistry.registerCommand(volume = new CommandVolume(), volume.getUnlocalizedName());
		CommandRegistry.registerCommand(pause = new CommandPause(), pause.getUnlocalizedName());
		CommandRegistry.registerCommand(leave = new CommandLeave(), leave.getUnlocalizedName());
		CommandRegistry.registerCommand(shuffle = new CommandShuffle(), shuffle.getUnlocalizedName());
	}
}
