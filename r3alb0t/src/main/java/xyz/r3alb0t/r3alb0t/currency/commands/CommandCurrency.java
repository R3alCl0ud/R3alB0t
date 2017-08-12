package xyz.r3alb0t.r3alb0t.currency.commands;

import java.util.HashMap;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;
import io.discloader.discloader.client.render.util.Resource;

/**
 * @author Perry Berman
 */
public class CommandCurrency extends CommandTree {
	
	private Map<String, Command> subs;
	private static Command enable;
	private static Command disable;
	private static Command give;
	
	/**
	 * 
	 */
	public CommandCurrency() {
		super("currency");
		setDescription("Base command for managing currency");
		subs = new HashMap<>();
		enable = new CommandEnable();
		disable = new CommandDisable();
		give = new CommandGive();
		subs.put(enable.getUnlocalizedName(), enable);
		subs.put(disable.getUnlocalizedName(), disable);
		subs.put(give.getUnlocalizedName(), give);
	}
	
	public Map<String, Command> getSubCommands() {
		return subs;
	}
	
	public Resource getResourceLocation() {
		return new Resource("r3alb0t", "texture/command/Currency.png");
	}
	
}
