package xyz.r3alb0t.r3alb0t.currency.commands;

import io.discloader.discloader.client.command.Command;
import io.discloader.discloader.common.event.message.MessageCreateEvent;
import io.discloader.discloader.entity.guild.IGuild;
import xyz.r3alb0t.r3alb0t.currency.Currency;
import xyz.r3alb0t.r3alb0t.util.DataBase;

public class CommandCalculate extends Command {

	public CommandCalculate() {
		super();
		setUnlocalizedName("calculate");
		setUsage("rewards calculate <price>");
		setDescription("Calculates the minimum amount of time it would take to accumulate `n` credits");
		setArgsRegex("(\\d+)");
	}

	public void execute(MessageCreateEvent e, String[] args) {
		IGuild guild = e.getMessage().getGuild();
		if (guild == null || args.length == 0 || args[0] == null) return;
		int price = Integer.parseInt(args[0], 10);
		String s = DataBase.getDataBase().get(Currency.coolDown(guild.getID())), in = DataBase.getDataBase().get(Currency.interest(guild.getID()));
		if (s == null) DataBase.getDataBase().set(Currency.coolDown(guild.getID()), "120");
		if (in == null) DataBase.getDataBase().set(Currency.interest(guild.getID()), "10");
		int cooldown = s == null ? 120 : Integer.parseInt(s, 10);
		long payout = in == null ? 10 : Integer.parseInt(in, 10);
		long times = price * cooldown;
		long time = (long) Math.ceil(((double) times) / ((double) payout));
		String content = String.format("It would take `%d:%02d:%02d`(h\\:m:s) to accumulate `¥%d` credits.", time / 3600, (time / 60) % 60, time % 60, price);
		e.getChannel().sendMessage(content);
	}
}
