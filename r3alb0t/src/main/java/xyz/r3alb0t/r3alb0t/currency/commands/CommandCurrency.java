package xyz.r3alb0t.r3alb0t.currency.commands;

import java.util.HashMap;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;

/**
 * @author Perry Berman
 *
 */
public class CommandCurrency extends CommandTree {
	private Map<String, Command> subs;
	private static Command enable;
	private static Command disable;
	
	/**
	 * 
	 */
	public CommandCurrency() {
		super("currency");
		subs = new HashMap<>();
		enable = new CommandEnable();
		disable = new CommandDisable();
		subs.put(enable.getUnlocalizedName(), enable);
		subs.put(disable.getUnlocalizedName(), disable);
	}
	
	public Map<String, Command> getSubCommands() {
		return subs;
	}
	
}
