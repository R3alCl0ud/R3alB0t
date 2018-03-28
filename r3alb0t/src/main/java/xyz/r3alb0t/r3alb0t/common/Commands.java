package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.registry.CommandRegistry;
import xyz.r3alb0t.r3alb0t.common.commands.CommandInfo;
import xyz.r3alb0t.r3alb0t.common.commands.CommandServerInfo;
import xyz.r3alb0t.r3alb0t.common.commands.CommandUserInfo;
import xyz.r3alb0t.r3alb0t.currency.commands.CommandBalance;
import xyz.r3alb0t.r3alb0t.currency.commands.CommandCurrency;
import xyz.r3alb0t.r3alb0t.currency.commands.CommandRewards;
import xyz.r3alb0t.r3alb0t.custom.commands.CommandCommands;
import xyz.r3alb0t.r3alb0t.logs.commands.CommandLogs;
import xyz.r3alb0t.r3alb0t.music.CommandJoin;
import xyz.r3alb0t.r3alb0t.music.CommandLeave;
import xyz.r3alb0t.r3alb0t.music.CommandNowPlaying;
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
	public static Command nowPlaying;
	
	// Misc commands
	public static Command commandInfo;
	public static Command commandUserInfo;
	public static Command commandServerInfo;
	public static Command commandTest; // using for testing emoji stuff
	
	// Logs commands
	public static Command logs;
	
	// Currency commands
	public static Command currency;
	public static Command balence;
	public static Command rewards;
	
	// Custom Commands commands
	public static Command commands;
	
	// public static Jedis DataBase = new Jedis("localhost");
	
	public static void registerCommands() {
		// Register misc/test commands
		CommandRegistry.registerCommand(commandInfo = new CommandInfo(), commandInfo.getUnlocalizedName());
		CommandRegistry.registerCommand(commandServerInfo = new CommandServerInfo(), commandServerInfo.getUnlocalizedName());
		CommandRegistry.registerCommand(commandUserInfo = new CommandUserInfo(), commandUserInfo.getUnlocalizedName());
		// CommandRegistry.registerCommand(commandTest = new CommandTest(),
		// commandTest.getUnlocalizedName());
		
		// Register Music commands
		CommandRegistry.registerCommand(join = new CommandJoin(), join.getUnlocalizedName());
		CommandRegistry.registerCommand(play = new CommandPlay(), play.getUnlocalizedName());
		CommandRegistry.registerCommand(volume = new CommandVolume(), volume.getUnlocalizedName());
		CommandRegistry.registerCommand(pause = new CommandPause(), pause.getUnlocalizedName());
		CommandRegistry.registerCommand(leave = new CommandLeave(), leave.getUnlocalizedName());
		CommandRegistry.registerCommand(shuffle = new CommandShuffle(), shuffle.getUnlocalizedName());
		CommandRegistry.registerCommand(queue = new CommandQueue(), queue.getUnlocalizedName());
		CommandRegistry.registerCommand(select = new CommandSelect(), select.getUnlocalizedName());
		CommandRegistry.registerCommand(nowPlaying = new CommandNowPlaying(), nowPlaying.getUnlocalizedName());;
		
		// Register Logs commands
		CommandRegistry.registerCommand(logs = new CommandLogs(), logs.getUnlocalizedName());
		
		// Register Currency commands;
		CommandRegistry.registerCommand(currency = new CommandCurrency(), currency.getUnlocalizedName());
		CommandRegistry.registerCommand(balence = new CommandBalance(), balence.getUnlocalizedName());
		CommandRegistry.registerCommand(rewards = new CommandRewards("rewards"), rewards.getUnlocalizedName());
		
		// Register CC commands
		CommandRegistry.registerCommand(commands = new CommandCommands(), commands.getUnlocalizedName());
	}
}
