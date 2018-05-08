package xyz.r3alb0t.r3alb0t.role.commands;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.client.command.CommandTree;

public class CommandRoles extends CommandTree {

	private Map<String, Command> subs;
	private List<String> aliases;

	private static Command CommandSet;
	private static Command CommandList;
	private static Command CommandClear;

	public CommandRoles(String unlocalizedName) {
		super(unlocalizedName);
		setDescription("Base command for managing ranks.");
		aliases = new ArrayList<>();
		aliases.add("ranks");
		subs = new HashMap<>();
		subs.put((CommandSet = new CommandSet()).getUnlocalizedName(), CommandSet);
		subs.put((CommandList = new CommandList()).getUnlocalizedName(), CommandList);
		subs.put((CommandClear = new CommandClear()).getUnlocalizedName(), CommandClear);
	}

	@Override
	public Map<String, Command> getSubCommands() {
		return subs;
	}

}
