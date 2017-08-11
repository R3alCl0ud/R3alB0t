package xyz.r3alb0t.r3alb0t.currency;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 *
 */
public class Currency {
	
	private static final List<Long> Guilds = new ArrayList<>();
	
	public static void load() {
		Set<String> guilds = DataBase.getDataBase().smembers("currency.guilds");
		for (String guild : guilds) {
			Guilds.add(Long.parseUnsignedLong(guild, 10));
		}
		
	}
	
	public static String userBal(long guildID, long userID) {
		return String.format("currency.%d:%d", guildID, userID);
	}
	
	public static String userCooldown(long guildID, long userID) {
		return String.format("currency.%d:%d.cooldown", guildID, userID);
	}
	
	/**
	 * @return the guilds
	 */
	public static List<Long> getGuilds() {
		return Guilds;
	}
}
