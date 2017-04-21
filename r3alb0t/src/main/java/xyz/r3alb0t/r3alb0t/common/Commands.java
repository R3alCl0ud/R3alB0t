package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.registry.CommandRegistry;
import xyz.r3alb0t.r3alb0t.logs.commands.CommandLogs;
import xyz.r3alb0t.r3alb0t.music.CommandJoin;
import xyz.r3alb0t.r3alb0t.music.CommandLeave;
import xyz.r3alb0t.r3alb0t.music.CommandPause;
import xyz.r3alb0t.r3alb0t.music.CommandPlay;
import xyz.r3alb0t.r3alb0t.music.CommandShuffle;
import xyz.r3alb0t.r3alb0t.music.CommandVolume;

public class Commands {

	// Music commands
	public static Command join;
	public static Command play;
	public static Command volume;
	public static Command pause;
	public static Command leave;
	public static Command shuffle;

	// Logs commands
	public static Command logs;

	public static void registerCommands() {

		// Register Music commands
		CommandRegistry.registerCommand(join = new CommandJoin(), join.getUnlocalizedName());
		CommandRegistry.registerCommand(play = new CommandPlay(), play.getUnlocalizedName());
		CommandRegistry.registerCommand(volume = new CommandVolume(), volume.getUnlocalizedName());
		CommandRegistry.registerCommand(pause = new CommandPause(), pause.getUnlocalizedName());
		CommandRegistry.registerCommand(leave = new CommandLeave(), leave.getUnlocalizedName());
		CommandRegistry.registerCommand(shuffle = new CommandShuffle(), shuffle.getUnlocalizedName());

		// Register Logs commands
		CommandRegistry.registerCommand(logs = new CommandLogs(), logs.getUnlocalizedName());
	}
}
