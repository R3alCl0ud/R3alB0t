package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.registry.CommandRegistry;
import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.custom.CustomCommands;
import xyz.r3alb0t.r3alb0t.logs.commands.CommandLogs;
import xyz.r3alb0t.r3alb0t.music.CommandJoin;
import xyz.r3alb0t.r3alb0t.music.CommandLeave;
import xyz.r3alb0t.r3alb0t.music.CommandPause;
import xyz.r3alb0t.r3alb0t.music.CommandPlay;
import xyz.r3alb0t.r3alb0t.music.CommandQueue;
import xyz.r3alb0t.r3alb0t.music.CommandSelect;
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
	public static Command select;
	public static Command queue;

	// Logs commands
	public static Command logs;

	public static Jedis DataBase = new Jedis("localhost");

	public static void registerCommands() {
		// start connection to the database
		// DataBase.connect();
		// DataBase.auth("B3$tP4$$");

		// load custom commands
		CustomCommands.loadCommands();

		// Register Music commands
		CommandRegistry.registerCommand(join = new CommandJoin(), join.getUnlocalizedName());
		CommandRegistry.registerCommand(play = new CommandPlay(), play.getUnlocalizedName());
		CommandRegistry.registerCommand(volume = new CommandVolume(), volume.getUnlocalizedName());
		CommandRegistry.registerCommand(pause = new CommandPause(), pause.getUnlocalizedName());
		CommandRegistry.registerCommand(leave = new CommandLeave(), leave.getUnlocalizedName());
		CommandRegistry.registerCommand(shuffle = new CommandShuffle(), shuffle.getUnlocalizedName());
		CommandRegistry.registerCommand(queue = new CommandQueue(), queue.getUnlocalizedName());
		CommandRegistry.registerCommand(select = new CommandSelect(), select.getUnlocalizedName());

		// Register Logs commands
		CommandRegistry.registerCommand(logs = new CommandLogs(), logs.getUnlocalizedName());
	}
}
