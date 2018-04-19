package xyz.r3alb0t.r3alb0t.common;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandHelp;
import io.discloader.discloader.common.registry.CommandRegistry;
import xyz.r3alb0t.r3alb0t.common.commands.CommandInfo;
import xyz.r3alb0t.r3alb0t.common.commands.CommandInvite;
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
	public static Command commandJoin;
	public static Command commandPlay;
	public static Command commandVolume;
	public static Command commandPause;
	public static Command commandLeave;
	public static Command commandShuffle;
	public static Command commandSelect;
	public static Command commandQueue;
	public static Command commandNowPlaying;
	
	// Misc commands
	public static Command commandInfo;
	public static Command commandUserInfo;
	public static Command commandServerInfo;
	public static Command commandTest; // using for testing emoji stuff
	public static Command commandInvite;
	public static Command commandHelp;
	
	// Logs commands
	public static Command commandLogs;
	
	// Currency commands
	public static Command commandCurrency;
	public static Command commandCalance;
	public static Command commandRewards;
	
	// Custom Commands commands
	public static Command commandCommands;
	
	public static void registerCommands() {
		
		// Register misc/test commands
		CommandRegistry.registerCommand(commandInfo = new CommandInfo(), commandInfo.getUnlocalizedName());
		CommandRegistry.registerCommand(commandServerInfo = new CommandServerInfo(), commandServerInfo.getUnlocalizedName());
		CommandRegistry.registerCommand(commandUserInfo = new CommandUserInfo(), commandUserInfo.getUnlocalizedName());
		CommandRegistry.registerCommand(commandHelp = new CommandHelp(), "help");
		CommandRegistry.registerCommand(commandInvite = new CommandInvite(), "invite");
		
		// Register Music commands
		CommandRegistry.registerCommand(commandJoin = new CommandJoin(), commandJoin.getUnlocalizedName());
		CommandRegistry.registerCommand(commandPlay = new CommandPlay(), commandPlay.getUnlocalizedName());
		CommandRegistry.registerCommand(commandVolume = new CommandVolume(), commandVolume.getUnlocalizedName());
		CommandRegistry.registerCommand(commandPause = new CommandPause(), commandPause.getUnlocalizedName());
		CommandRegistry.registerCommand(commandLeave = new CommandLeave(), commandLeave.getUnlocalizedName());
		CommandRegistry.registerCommand(commandShuffle = new CommandShuffle(), commandShuffle.getUnlocalizedName());
		CommandRegistry.registerCommand(commandQueue = new CommandQueue(), commandQueue.getUnlocalizedName());
		CommandRegistry.registerCommand(commandSelect = new CommandSelect(), commandSelect.getUnlocalizedName());
		CommandRegistry.registerCommand(commandNowPlaying = new CommandNowPlaying(), commandNowPlaying.getUnlocalizedName());;
		
		// Register Logs commands
		CommandRegistry.registerCommand(commandLogs = new CommandLogs(), commandLogs.getUnlocalizedName());
		
		// Register Currency commands;
		CommandRegistry.registerCommand(commandCurrency = new CommandCurrency(), commandCurrency.getUnlocalizedName());
		CommandRegistry.registerCommand(commandCalance = new CommandBalance(), commandCalance.getUnlocalizedName());
		CommandRegistry.registerCommand(commandRewards = new CommandRewards("rewards"), commandRewards.getUnlocalizedName());
		
		// Register CC commands
		CommandRegistry.registerCommand(commandCommands = new CommandCommands(), commandCommands.getUnlocalizedName());
	}
}
